const supabase = require('../config/supabase');

/**
 * Render Homepage
 */
const getHomePage = async (req, res) => {
  try {
    const { data: featuredProducts } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('is_available', true)
      .order('display_order', { ascending: true })
      .limit(6);

    res.render('public/index', {
      title: 'Qfi Coffee & Bakery | Lezzet & Kahve Deneyimi',
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
 * Render Interactive Menu Page (Pinterest Style UI)
 */
const getMenuPage = async (req, res) => {
  try {
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    const { data: products } = await supabase
      .from('products')
      .select('*, categories(id, name, slug)')
      .order('display_order', { ascending: true });

    const selectedCategory = req.query.category || 'all';

    res.render('public/menu', {
      title: 'Kahve & Lezzet Menüsü | Qfi Coffee',
      categories: categories || [],
      products: products || [],
      selectedCategory
    });
  } catch (error) {
    console.error('Menu controller error:', error);
    res.status(500).render('public/menu', {
      title: 'Menü | Qfi Coffee',
      categories: [],
      products: [],
      selectedCategory: 'all',
      error: 'Menü yüklenirken bir hata oluştu.'
    });
  }
};

/**
 * Render About Us Page
 */
const getAboutPage = (req, res) => {
  res.render('public/about', {
    title: 'Hakkımızda | Qfi Coffee & Bakery'
  });
};

/**
 * Render Contact & Location Page (Exact Qfi Cafe Address)
 */
const getContactPage = (req, res) => {
  res.render('public/contact', {
    title: 'Bize Ulaşın & Konum | Qfi Coffee',
    cafeInfo: {
      address: 'Dumlupınar, Sahaf Sk No:3 D:A, 34000 Pendik/İstanbul',
      phone: '0501 558 09 58',
      phoneRaw: '05015580958',
      hours: 'Her Gün: 09:00 - 23:30',
      mapsUrl: 'https://maps.app.goo.gl/a2nsSuwbPQ1amwEe7'
    }
  });
};

module.exports = {
  getHomePage,
  getMenuPage,
  getAboutPage,
  getContactPage
};
