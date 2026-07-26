const supabase = require('../config/supabase');

/**
 * Render Public Homepage
 */
const getHomePage = async (req, res) => {
  try {
    // Fetch top 4 featured products for home highlight
    const { data: featuredProducts } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('is_available', true)
      .order('display_order', { ascending: true })
      .limit(4);

    res.render('public/index', {
      title: 'Qfi Coffee & Bakery | Boutique Cafe & QR Menü',
      featuredProducts: featuredProducts || []
    });
  } catch (error) {
    console.error('Home controller error:', error);
    res.render('public/index', {
      title: 'Qfi Coffee & Bakery',
      featuredProducts: []
    });
  }
};

/**
 * Render Public Interactive QR Menu Page
 */
const getMenuPage = async (req, res) => {
  try {
    // Fetch categories ordered by display_order
    const { data: categories, error: catErr } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (catErr) throw catErr;

    // Fetch active products
    const { data: products, error: prodErr } = await supabase
      .from('products')
      .select('*, categories(id, name, slug)')
      .order('display_order', { ascending: true });

    if (prodErr) throw prodErr;

    const selectedCategory = req.query.category || 'all';

    res.render('public/menu', {
      title: 'QR Menü | Qfi Coffee',
      categories: categories || [],
      products: products || [],
      selectedCategory
    });
  } catch (error) {
    console.error('Menu controller error:', error);
    res.status(500).render('public/menu', {
      title: 'QR Menü',
      categories: [],
      products: [],
      selectedCategory: 'all',
      error: 'Menü yüklenirken bir hata oluştu.'
    });
  }
};

module.exports = {
  getHomePage,
  getMenuPage
};
