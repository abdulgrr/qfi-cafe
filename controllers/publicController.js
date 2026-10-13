const supabase = require('../config/supabase');
const settingsService = require('../services/settingsService');

/**
 * Render Homepage
 */
const getHomePage = async (req, res) => {
  try {
    const featuredIds = await settingsService.getFeaturedProductIds();
    let featuredProducts = [];

    if (featuredIds && featuredIds.length > 0) {
      const { data } = await supabase
        .from('products')
        .select('*, categories(name)')
        .in('id', featuredIds);

      if (data && data.length > 0) {
        featuredProducts = featuredIds
          .map(id => data.find(p => p.id === id))
          .filter(Boolean);
      }
    }

    // If no products were specifically selected, fallback to top products
    if (featuredProducts.length === 0) {
      const { data } = await supabase
        .from('products')
        .select('*, categories(name)')
        .order('display_order', { ascending: true })
        .limit(6);
      featuredProducts = data || [];
    }

    const allTags = await settingsService.getAllProductTags();
    featuredProducts.forEach(p => {
      p.tags = p.tags || allTags[p.id] || '';
    });

    res.render('public/index', {
      title: 'Qfi Cafe | Pendik Butik Cafe & Lezzet Deneyimi',
      featuredProducts: featuredProducts || []
    });
  } catch (error) {
    console.error('Home controller error:', error);
    res.render('public/index', {
      title: 'Qfi Cafe | Pendik Butik Cafe',
      featuredProducts: []
    });
  }
};

/**
 * Render Interactive Menu Page
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

    const allTags = await settingsService.getAllProductTags();
    (products || []).forEach(p => {
      p.tags = p.tags || allTags[p.id] || '';
    });

    const selectedCategory = req.query.category || 'all';

    res.render('public/menu', {
      title: 'Kahve & Lezzet Menüsü | Qfi Cafe',
      categories: categories || [],
      products: products || [],
      selectedCategory
    });
  } catch (error) {
    console.error('Menu controller error:', error);
    res.status(500).render('public/menu', {
      title: 'Menü | Qfi Cafe',
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
    title: 'Hakkımızda | Qfi Cafe'
  });
};

/**
 * Render Contact & Location Page (Exact Qfi Cafe Address)
 */
const getContactPage = (req, res) => {
  res.render('public/contact', {
    title: 'Bize Ulaşın & Konum | Qfi Cafe'
  });
};

module.exports = {
  getHomePage,
  getMenuPage,
  getAboutPage,
  getContactPage
};
