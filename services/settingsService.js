const fs = require('fs');
const path = require('path');
const supabase = require('../config/supabase');
const { uploadToCloudinary } = require('../config/cloudinary');

const BUNDLED_DATA_FILE = path.join(process.cwd(), 'data', 'site_settings.json');
const TMP_DATA_FILE = path.join('/tmp', 'site_settings.json');

const defaultSettings = {
  cafe_name: 'Qfi Cafe',
  hero_badge: "Pendik'in En Sevilen Butik Kafesi",
  hero_title: 'Sıcak Bir Kahve, Eşsiz Lezzetler.',
  hero_subtitle: "Pendik'in kalbinde özenle seçilmiş 3. nesil kahve çekirdekleri, günlük fırından taze çıkan boutique tatlılar ve huzur dolu atmosfer Qfi Cafe'de sizi bekliyor.",
  hero_image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=900&q=80',
  
  // Spotlight / Günün Öne Çıkanı
  spotlight_badge: 'Haftanın Özel Önerisi',
  spotlight_title: 'Özel V60 Filtre & Taze Çikolatalı Kruvasan',
  spotlight_description: 'Etiyopya Yirgacheffe çekirdeklerimizle demlenen taze filtre kahve ve Belçika çikolatalı fırından yeni çıkmış sıcak kruvasan ile güne mükemmel bir mola verin.',
  spotlight_price: '280.00',
  spotlight_image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=700&q=80',
  spotlight_button_text: 'Menüyü Gör',

  // 3 Özellik Kartı
  feature_1_title: '3. Nesil Kahve Çekirdekleri',
  feature_1_desc: 'Dünyanın en nitelikli tarlalarından özenle seçilmiş %100 Arabica kahveler.',
  feature_2_title: 'Günlük Taze Fırın',
  feature_2_desc: 'Her sabah fırınlanan taze kruvasanlar, San Sebastian ve ev yapımı tatlılar.',
  feature_3_title: 'Sıcak & Samimi Atmosfer',
  feature_3_desc: "Pendik'te ister çalışmak ister sohbet etmek için en huzurlu alan.",

  // Hakkımızda Sayfası
  about_title: 'Kahve Tutkumuz ve Hikayemiz',
  about_subtitle: "Qfi Cafe olarak Pendik'te misafirlerimize unutulmaz bir lezzet ve kahve deneyimi sunuyoruz.",
  about_story_1: 'Kahvelerimizde dünyanın önde gelen tarlalarından özenle seçilen %100 Arabica çekirdeklerini kullanıyoruz. Taze taze kavrulan çekirdeklerimiz, işinde uzman barista ekibimiz tarafından özel derece ve oranlarla demlenmektedir.',
  about_story_2: 'Kahvenin yanına en çok yakışan boutique tatlılarımız ve çıtır kruvasanlarımız günlük olarak fırınlanmaktadır. San Sebastian Cheesecake, Belçika çikolatalı kruvasan ve özel tarifli tatlılarımızla damağınızda unutulmaz bir iz bırakıyoruz.',
  about_image_1: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
  about_image_2: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80',

  // İletişim & Konum
  address: 'Dumlupınar, Sahaf Sk No:3 D:A, 34000 Pendik/İstanbul',
  phone: '0501 558 09 58',
  phone_raw: '05015580958',
  working_hours: 'Her Gün: 09:00 - 23:30',
  maps_url: 'https://maps.app.goo.gl/a2nsSuwbPQ1amwEe7',
  instagram_url: 'https://instagram.com/'
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

/**
 * Get current site settings (Supabase first, fallback to local file)
 */
async function getSettings() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      // Table doesn't exist yet or connection error -> use local fallback
      return readLocalSettings();
    }

    if (data) {
      return { ...defaultSettings, ...data };
    }
  } catch (err) {
    console.warn('Supabase site_settings read error, using fallback:', err.message);
  }

  return readLocalSettings();
}

/**
 * Update site settings (both to Supabase and local file)
 * Also uploads any new images to Cloudinary
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

  // Generate phone_raw if phone updated
  if (fields.phone) {
    updated.phone_raw = fields.phone.replace(/\D/g, '');
  }

  // Handle uploaded files (Cloudinary)
  const imageFieldNames = ['hero_image', 'spotlight_image', 'about_image_1', 'about_image_2'];
  for (const imgField of imageFieldNames) {
    if (files && files[imgField] && files[imgField][0]) {
      try {
        const file = files[imgField][0];
        const uploadResult = await uploadToCloudinary(file.buffer, 'qfi_cafe_settings');
        if (uploadResult && uploadResult.secure_url) {
          updated[imgField] = uploadResult.secure_url;
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
    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 1, ...updated, updated_at: new Date().toISOString() });

    if (error) {
      console.warn('Supabase site_settings upsert error (table may need creation):', error.message);
    }
  } catch (supabaseErr) {
    console.warn('Supabase site_settings error:', supabaseErr.message);
  }

  return updated;
}

module.exports = {
  defaultSettings,
  getSettings,
  updateSettings
};
