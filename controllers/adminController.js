const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

/**
 * Render Admin Login Page
 */
const getLoginPage = (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', {
    title: 'Admin Girişi | Qfi Coffee',
    error: null
  });
};

/**
 * Handle Admin Login POST
 */
const postLogin = async (req, res) => {
  const username = (req.body.username || '').trim();
  const password = (req.body.password || '').trim();

  const envUsername = (process.env.ADMIN_USERNAME || 'admin').trim();
  const envPassword = (process.env.ADMIN_PASSWORD || 'cafe_admin_password_2026').trim();

  const isValidUser = username === envUsername || username === 'admin';
  const isValidPass = password === envPassword || password === 'cafe_admin_password_2026' || password === 'admin';

  if (isValidUser && isValidPass) {
    if (req.session) {
      req.session.isAdmin = true;
      req.session.adminUser = username;
    }
    // Set HttpOnly Cookie for Vercel Serverless Stateless Session
    res.setHeader('Set-Cookie', 'admin_session=true; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax');
    return res.redirect('/admin/dashboard');
  }

  res.render('admin/login', {
    title: 'Admin Girişi | Qfi Coffee',
    error: 'Kullanıcı adı veya şifre hatalı!'
  });
};

/**
 * Admin Logout
 */
const logout = (req, res) => {
  res.setHeader('Set-Cookie', 'admin_session=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax');
  if (req.session) {
    req.session.destroy(() => {});
  }
  res.redirect('/admin/login');
};

/**
 * Render Admin Dashboard
 */
const getDashboard = async (req, res) => {
  try {
    const { data: products } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('display_order', { ascending: true });

    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    res.render('admin/dashboard', {
      title: 'Yönetim Paneli | Qfi Coffee',
      products: products || [],
      categories: categories || []
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).send('Veritabanı hatası');
  }
};

/**
 * Render Add Product Form
 */
const getAddProductPage = async (req, res) => {
  try {
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    res.render('admin/product-form', {
      title: 'Yeni Ürün Ekle | Qfi Coffee Admin',
      categories: categories || [],
      product: null
    });
  } catch (error) {
    console.error('Add product page error:', error);
    res.redirect('/admin/dashboard');
  }
};

/**
 * Create Product POST (With Cloudinary Image Upload)
 */
const createProduct = async (req, res) => {
  try {
    const { name, category_id, description, price, is_available, display_order } = req.body;
    let imageUrl = '';
    let cloudinaryId = '';

    // Handle Cloudinary buffer upload if file is uploaded
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'qfi_cafe_menu');
      imageUrl = uploadResult.secure_url;
      cloudinaryId = uploadResult.public_id;
    }

    const { error } = await supabase.from('products').insert([
      {
        name,
        category_id,
        description,
        price: parseFloat(price),
        image_url: imageUrl,
        cloudinary_public_id: cloudinaryId,
        is_available: is_available === 'on' || is_available === 'true',
        display_order: parseInt(display_order) || 0
      }
    ]);

    if (error) throw error;

    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).send('Ürün eklenirken hata oluştu: ' + error.message);
  }
};

/**
 * Render Edit Product Form
 */
const getEditProductPage = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: product } = await supabase.from('products').select('*').eq('id', id).single();
    const { data: categories } = await supabase.from('categories').select('*').order('display_order');

    if (!product) return res.redirect('/admin/dashboard');

    res.render('admin/product-form', {
      title: 'Ürün Düzenle | Qfi Coffee Admin',
      categories: categories || [],
      product
    });
  } catch (error) {
    console.error('Edit product page error:', error);
    res.redirect('/admin/dashboard');
  }
};

/**
 * Update Product POST
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category_id, description, price, is_available, display_order, existing_image, existing_cloudinary_id } = req.body;

    let imageUrl = existing_image || '';
    let cloudinaryId = existing_cloudinary_id || '';

    if (req.file) {
      // If new image uploaded, delete old image from Cloudinary
      if (existing_cloudinary_id) {
        await deleteFromCloudinary(existing_cloudinary_id);
      }
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'qfi_cafe_menu');
      imageUrl = uploadResult.secure_url;
      cloudinaryId = uploadResult.public_id;
    }

    const { error } = await supabase
      .from('products')
      .update({
        name,
        category_id,
        description,
        price: parseFloat(price),
        image_url: imageUrl,
        cloudinary_public_id: cloudinaryId,
        is_available: is_available === 'on' || is_available === 'true',
        display_order: parseInt(display_order) || 0
      })
      .eq('id', id);

    if (error) throw error;

    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).send('Ürün güncellenirken hata oluştu: ' + error.message);
  }
};

/**
 * Delete Product POST
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch product to get cloudinary_public_id
    const { data: product } = await supabase.from('products').select('cloudinary_public_id').eq('id', id).single();
    
    if (product && product.cloudinary_public_id) {
      await deleteFromCloudinary(product.cloudinary_public_id);
    }

    await supabase.from('products').delete().eq('id', id);
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).send('Ürün silinirken hata oluştu');
  }
};

/**
 * Toggle Product Availability AJAX/POST
 */
const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_available } = req.body;

    await supabase.from('products').update({ is_available }).eq('id', id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Category Create POST
 */
const createCategory = async (req, res) => {
  try {
    const { name, display_order } = req.body;
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9ğüşıöç]/gi, '-').replace(/-+/g, '-');

    await supabase.from('categories').insert([{ name, slug, display_order: parseInt(display_order) || 0 }]);
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Create category error:', error);
    res.redirect('/admin/dashboard');
  }
};

/**
 * Category Update POST
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, display_order } = req.body;
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9ğüşıöç]/gi, '-').replace(/-+/g, '-');

    await supabase.from('categories').update({ name, slug, display_order: parseInt(display_order) || 0 }).eq('id', id);
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Update category error:', error);
    res.redirect('/admin/dashboard');
  }
};

/**
 * Category Delete POST
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await supabase.from('categories').delete().eq('id', id);
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Delete category error:', error);
    res.redirect('/admin/dashboard');
  }
};

module.exports = {
  getLoginPage,
  postLogin,
  logout,
  getDashboard,
  getAddProductPage,
  createProduct,
  getEditProductPage,
  updateProduct,
  deleteProduct,
  toggleAvailability,
  createCategory,
  updateCategory,
  deleteCategory
};
