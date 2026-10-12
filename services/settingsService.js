const fs = require('fs');
const path = require('path');
const supabase = require('../config/supabase');
const { uploadToCloudinary } = require('../config/cloudinary');

const BUNDLED_DATA_FILE = path.join(process.cwd(), 'data', 'site_settings.json');
const TMP_DATA_FILE = path.join('/tmp', 'site_settings.json');

const BUNDLED_TAGS_FILE = path.join(process.cwd(), 'data', 'product_tags.json');
const TMP_TAGS_FILE = path.join('/tmp', 'product_tags.json');

const defaultSettings = {
  // Brand & Logo
  cafe_name: 'Qfi Cafe',
  logo_url: '', // Custom uploaded logo image URL

  // Hero Section (Ana Sayfa Başlık & Butonlar)
  hero_badge: "Pendik'in En İddialı Butik Kafesi",
  hero_title: 'Sıcak Bir Kahve, Eşsiz Lezzetler.',
  hero_subtitle: "Pendik'in kalbinde özenle seçilmiş 3. nesil kahve çekirdekleri, günlük fırından taze çıkan boutique tatlılar ve huzur dolu atmosfer Qfi Cafe'de sizi bekliyor.",
  hero_btn1_text: 'Lezzet Menüsü',
  hero_btn2_text: 'Bize Ulaşın',

  // Hero Carousel Slider Images (4-5 Images)
  hero_slide_1: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1000&q=80',
  hero_slide_2: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&q=80',
  hero_slide_3: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&q=80',
  hero_slide_4: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1000&q=80',
  hero_slide_5: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1000&q=80',

  // 3 Özellik Kartı
  feature_1_title: '3. Nesil Kahve Çekirdekleri',
  feature_1_desc: 'Dünyanın en nitelikli tarlalarından özenle seçilmiş %100 Arabica kahveler.',
  feature_2_title: 'Günlük Taze Fırın',
  feature_2_desc: 'Her sabah fırınlanan taze kruvasanlar, San Sebastian ve ev yapımı tatlılar.',
  feature_3_title: 'Sıcak & Samimi Atmosfer',
  feature_3_desc: "Pendik'te ister çalışmak ister sohbet etmek için en huzurlu alan.",

  // Spotlight / Günün Öne Çıkanı Vitrini
  spotlight_badge: 'Haftanın Özel Önerisi',
  spotlight_title: 'Özel V60 Filtre & Taze Çikolatalı Kruvasan',
  spotlight_description: 'Etiyopya Yirgacheffe çekirdeklerimizle demlenen taze filtre kahve ve Belçika çikolatalı fırından yeni çıkmış sıcak kruvasan ile güne mükemmel bir mola verin.',
  spotlight_image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=900&q=80',
  spotlight_button_text: 'Menüde Keşfet',

  // Atmosfer Galerisi Başlığı
  gallery_title: 'Qfi Cafe Atmosferi',
  gallery_subtitle: "Sıcak ahşap dokular, taze kahve kokusu ve Pendik'te huzurlu anlar",

  // Menü Sayfası Başlıkları
  menu_title: 'Kahve & Lezzet Menüsü',
  menu_subtitle: 'Tüm kahve ve fırın lezzetlerimizi inceleyebilirsiniz.',

  // Hakkımızda Sayfası
  about_title: 'Kahve Tutkumuz ve Hikayemiz',
  about_subtitle: "Qfi Cafe olarak Pendik'te misafirlerimize unutulmaz bir lezzet ve kahve deneyimi sunuyoruz.",
  about_sec1_title: 'Özenle Seçilmiş 3. Nesil Çekirdekler',
  about_story_1: 'Kahvelerimizde dünyanın önde gelen tarlalarından özenle seçilen %100 Arabica çekirdeklerini kullanıyoruz. Taze taze kavrulan çekirdeklerimiz, işinde uzman barista ekibimiz tarafından özel derece ve oranlarla demlenmektedir.',
  about_sec2_title: 'Günlük Taze Fırın Lezzetleri',
  about_story_2: 'Kahvenin yanına en çok yakışan boutique tatlılarımız ve çıtır kruvasanlarımız günlük olarak fırınlanmaktadır. San Sebastian Cheesecake, Belçika çikolatalı kruvasan ve özel tarifli tatlılarımızla damağınızda unutulmaz bir iz bırakıyoruz.',
  about_image_1: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
  about_image_2: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80',

  // İletişim & Konum
  address: 'Dumlupınar, Sahaf Sk No:3 D:A, 34000 Pendik/İstanbul',
  phone: '0501 558 09 58',
  phone_raw: '05015580958',
  working_hours: 'Her Gün: 09:00 - 23:30',
  maps_url: 'https://maps.app.goo.gl/a2nsSuwbPQ1amwEe7',
  instagram_url: 'https://instagram.com/',
  footer_desc: "Özenle seçilmiş kahve çekirdekleri, günlük taze pişen özel tatlılar ve Pendik'in samimi atmosferi."
};

/**
 * Read local fallback JSON
 */
function readLocalSettings() {
  try {
    if (fs.existsSync(TMP_DATA_FILE)) {
      const raw = fs.readFileSync(TMP_DATA_FILE, 'utf8');
      return { ...defaultSettings, ...JSON.parse(raw) };
    }
    if (fs.existsSync(BUNDLED_DATA_FILE)) {
      const raw = fs.readFileSync(BUNDLED_DATA_FILE, 'utf8');
      return { ...defaultSettings, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Local settings read warning:', e.message);
  }
  return { ...defaultSettings };
}

/**
 * Save to local fallback JSON
 */
function saveLocalSettings(data) {
  try {
    const dir = path.dirname(BUNDLED_DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(BUNDLED_DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    try {
      fs.writeFileSync(TMP_DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (tmpErr) {
      console.warn('Local settings save warning:', tmpErr.message);
    }
  }
}

const ALLOWED_DB_COLUMNS = new Set([
  'id', 'cafe_name', 'logo_url', 'hero_badge', 'hero_title', 'hero_subtitle',
  'hero_btn1_text', 'hero_btn2_text', 'hero_slide_1', 'hero_slide_2', 'hero_slide_3',
  'hero_slide_4', 'hero_slide_5', 'feature_1_title', 'feature_1_desc', 'feature_2_title',
  'feature_2_desc', 'feature_3_title', 'feature_3_desc', 'spotlight_badge', 'spotlight_title',
  'spotlight_description', 'spotlight_button_text', 'spotlight_image', 'gallery_title',
  'gallery_subtitle', 'menu_title', 'menu_subtitle', 'about_title', 'about_subtitle',
  'about_sec1_title', 'about_story_1', 'about_sec2_title', 'about_story_2',
  'about_image_1', 'about_image_2', 'phone', 'phone_raw', 'working_hours',
  'instagram_url', 'address', 'maps_url', 'footer_desc', 'updated_at'
]);

function buildDbPayload(obj) {
  const payload = {};
  for (const [k, v] of Object.entries(obj)) {
    if (ALLOWED_DB_COLUMNS.has(k) && v !== undefined && v !== null) {
      payload[k] = v;
    }
  }
  payload.id = 1;
  payload.updated_at = new Date().toISOString();
  return payload;
}

/**
 * Get current site settings (Supabase first, fallback to local file)
 */
async function getSettings() {
  const local = readLocalSettings();
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      return local;
    }

    if (data) {
      // If table row exists but is empty (e.g. freshly created with null values), initialize it with local settings!
      if (!data.cafe_name) {
        try {
          const seedPayload = buildDbPayload(local);
          await supabase.from('site_settings').update(seedPayload).eq('id', 1);
        } catch (seedErr) {
          console.warn('Initial seed error:', seedErr.message);
        }
        return local;
      }

      // Merge data, ignoring null or undefined columns
      const merged = { ...defaultSettings, ...local };
      for (const [key, val] of Object.entries(data)) {
        if (val !== null && val !== undefined) {
          merged[key] = val;
        }
      }
      return merged;
    }
  } catch (err) {
    console.warn('Supabase site_settings read error, using fallback:', err.message);
  }

  return local;
}

/**
 * Update site settings
 */
async function updateSettings(fields, files = {}) {
  const current = await getSettings();
  const updated = { ...current };

  // Update text fields
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) {
      updated[key] = typeof value === 'string' ? value.trim() : value;
    }
  }

  // Handle logo removal
  if (fields.remove_logo === 'true' || fields.remove_logo === '1') {
    updated.logo_url = '';
  }

  // Generate phone_raw if phone updated
  if (fields.phone) {
    updated.phone_raw = fields.phone.replace(/\D/g, '');
  }

  // Handle uploaded files (Cloudinary)
  const imageFieldNames = [
    'logo_image',
    'hero_slide_1',
    'hero_slide_2',
    'hero_slide_3',
    'hero_slide_4',
    'hero_slide_5',
    'spotlight_image',
    'about_image_1',
    'about_image_2'
  ];

  for (const imgField of imageFieldNames) {
    if (files && files[imgField] && files[imgField][0]) {
      try {
        const file = files[imgField][0];
        const uploadResult = await uploadToCloudinary(file.buffer, 'qfi_cafe_settings');
        if (uploadResult && uploadResult.secure_url) {
          if (imgField === 'logo_image') {
            updated.logo_url = uploadResult.secure_url;
          } else {
            updated[imgField] = uploadResult.secure_url;
          }
        }
      } catch (uploadErr) {
        console.error(`Error uploading ${imgField} to Cloudinary:`, uploadErr);
      }
    }
  }

  // Always save to local fallback
  saveLocalSettings(updated);

  // Try saving to Supabase if table exists
  try {
    const dbPayload = buildDbPayload(updated);
    const { error } = await supabase
      .from('site_settings')
      .upsert(dbPayload);

    if (error) {
      console.warn('Supabase site_settings upsert error:', error.message);
    }
  } catch (supabaseErr) {
    console.warn('Supabase site_settings error:', supabaseErr.message);
  }

  return updated;
}

/**
 * Helper: Product Tags Mapping (Stores custom badges for each product)
 */
function getAllProductTags() {
  try {
    if (fs.existsSync(TMP_TAGS_FILE)) {
      return JSON.parse(fs.readFileSync(TMP_TAGS_FILE, 'utf8'));
    }
    if (fs.existsSync(BUNDLED_TAGS_FILE)) {
      return JSON.parse(fs.readFileSync(BUNDLED_TAGS_FILE, 'utf8'));
    }
  } catch (e) {
    console.warn('Product tags read error:', e.message);
  }
  return {};
}

function saveProductTags(tagsMap) {
  try {
    const dir = path.dirname(BUNDLED_TAGS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(BUNDLED_TAGS_FILE, JSON.stringify(tagsMap, null, 2), 'utf8');
  } catch (e) {
    try {
      fs.writeFileSync(TMP_TAGS_FILE, JSON.stringify(tagsMap, null, 2), 'utf8');
    } catch (tmpErr) {
      console.warn('TMP product tags save error:', tmpErr.message);
    }
  }
}

function setProductTags(productId, tagsString) {
  if (!productId) return;
  const map = getAllProductTags();
  if (tagsString && tagsString.trim()) {
    map[productId] = tagsString.trim();
  } else {
    delete map[productId];
  }
  saveProductTags(map);
}

function getProductTags(productId) {
  if (!productId) return '';
  const map = getAllProductTags();
  return map[productId] || '';
}

async function checkSupabaseTableStatus() {
  try {
    const { error } = await supabase.from('site_settings').select('id').limit(1);
    if (!error) return true;
    return false;
  } catch (e) {
    return false;
  }
}

module.exports = {
  defaultSettings,
  getSettings,
  updateSettings,
  getAllProductTags,
  setProductTags,
  getProductTags,
  checkSupabaseTableStatus
};
