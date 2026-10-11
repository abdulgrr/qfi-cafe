-- ===================================================
-- BUTIK CAFE - SUPABASE POSTGRESQL SCHEMA & SEED DATA
-- ===================================================

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    cloudinary_public_id TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Indexes for High Performance Querying
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(display_order);

-- 4. Enable Row Level Security (RLS) - Public Read Access
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access (Public QR Menu)
CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);

-- Allow full access to anon/service_role for CRUD operations handled by server controller
CREATE POLICY "Allow full categories access for authenticated app" ON categories FOR ALL USING (true);
CREATE POLICY "Allow full products access for authenticated app" ON products FOR ALL USING (true);

-- ===================================================
-- SAMPLE SEED DATA
-- ===================================================

-- Insert Initial Categories
INSERT INTO categories (name, slug, display_order) VALUES
('Sıcak Kahveler', 'sicak-kahveler', 1),
('Soğuk Kahveler & İçecekler', 'soguk-kahveler', 2),
('Boutique Tatlılar', 'boutique-tatlilar', 3),
('Kahvaltı & Atıştırmalık', 'kahvalti-atistirmalik', 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert Sample Products
DO $$
DECLARE
    cat_sicak UUID;
    cat_soguk UUID;
    cat_tatli UUID;
    cat_atistirmalik UUID;
BEGIN
    SELECT id INTO cat_sicak FROM categories WHERE slug = 'sicak-kahveler' LIMIT 1;
    SELECT id INTO cat_soguk FROM categories WHERE slug = 'soguk-kahveler' LIMIT 1;
    SELECT id INTO cat_tatli FROM categories WHERE slug = 'boutique-tatlilar' LIMIT 1;
    SELECT id INTO cat_atistirmalik FROM categories WHERE slug = 'kahvalti-atistirmalik' LIMIT 1;

    INSERT INTO products (category_id, name, description, price, image_url, is_available, display_order) VALUES
    (cat_sicak, 'Flat White', 'Çifte shot espresso ve mikro köpüklü taze süt.', 140.00, 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=600', true, 1),
    (cat_sicak, 'V60 Pour Over', 'Özel kavrum Etiyopya çekirdekleri ile demlenmiş 3. nesil filtre kahve.', 160.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600', true, 2),
    (cat_soguk, 'Iced Spanish Latte', 'Espresso, soğuk süt ve tatlandırılmış yoğunlaştırılmış süt ikilisi.', 175.00, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600', true, 1),
    (cat_soguk, 'Cold Brew Nitro', '24 saat soğuk demlenmiş yumuşak içimli nitro soğuk kahve.', 180.00, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600', true, 2),
    (cat_tatli, 'San Sebastian Cheesecake', 'İçi akışkan, karamelize üst dokulu İspanyol klasiği.', 220.00, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600', true, 1),
    (cat_tatli, 'Belçika Çikolatalı Croissant', 'Tereyağlı taze kruvasan içerisinde eritilmiş Callebaut çikolata.', 190.00, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600', true, 2),
    (cat_atistirmalik, 'Avokado & Poşe Yumurtalı Tost', 'Ekşi mayalı ekmek üzerinde ezilmiş avokado ve organik poşe yumurta.', 260.00, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600', true, 1)
    ON CONFLICT DO NOTHING;
END $$;

-- 5. Create Site Settings & CMS Table
CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    cafe_name VARCHAR(150) DEFAULT 'Qfi Cafe',
    hero_badge VARCHAR(150) DEFAULT 'Pendik''in En Sevilen Butik Kafesi',
    hero_title VARCHAR(255) DEFAULT 'Sıcak Bir Kahve, Eşsiz Lezzetler.',
    hero_subtitle TEXT DEFAULT 'Pendik''in kalbinde özenle seçilmiş 3. nesil kahve çekirdekleri, günlük fırından taze çıkan boutique tatlılar ve huzur dolu atmosfer Qfi Cafe''de sizi bekliyor.',
    hero_image TEXT DEFAULT 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=900&q=80',
    spotlight_badge VARCHAR(150) DEFAULT 'Haftanın Özel Önerisi',
    spotlight_title VARCHAR(255) DEFAULT 'Özel V60 Filtre & Taze Çikolatalı Kruvasan',
    spotlight_description TEXT DEFAULT 'Etiyopya Yirgacheffe çekirdeklerimizle demlenen taze filtre kahve ve Belçika çikolatalı fırından yeni çıkmış sıcak kruvasan ile güne mükemmel bir mola verin.',
    spotlight_price VARCHAR(50) DEFAULT '280.00',
    spotlight_image TEXT DEFAULT 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=700&q=80',
    spotlight_button_text VARCHAR(50) DEFAULT 'Menüyü Gör',
    feature_1_title VARCHAR(150) DEFAULT '3. Nesil Kahve Çekirdekleri',
    feature_1_desc TEXT DEFAULT 'Dünyanın en nitelikli tarlalarından özenle seçilmiş %100 Arabica kahveler.',
    feature_2_title VARCHAR(150) DEFAULT 'Günlük Taze Fırın',
    feature_2_desc TEXT DEFAULT 'Her sabah fırınlanan taze kruvasanlar, San Sebastian ve ev yapımı tatlılar.',
    feature_3_title VARCHAR(150) DEFAULT 'Sıcak & Samimi Atmosfer',
    feature_3_desc TEXT DEFAULT 'Pendik''te ister çalışmak ister sohbet etmek için en huzurlu alan.',
    about_title VARCHAR(255) DEFAULT 'Kahve Tutkumuz ve Hikayemiz',
    about_subtitle TEXT DEFAULT 'Qfi Cafe olarak Pendik''te misafirlerimize unutulmaz bir lezzet ve kahve deneyimi sunuyoruz.',
    about_story_1 TEXT DEFAULT 'Kahvelerimizde dünyanın önde gelen tarlalarından özenle seçilen %100 Arabica çekirdeklerini kullanıyoruz. Taze taze kavrulan çekirdeklerimiz, işinde uzman barista ekibimiz tarafından özel derece ve oranlarla demlenmektedir.',
    about_story_2 TEXT DEFAULT 'Kahvenin yanına en çok yakışan boutique tatlılarımız ve çıtır kruvasanlarımız günlük olarak fırınlanmaktadır. San Sebastian Cheesecake, Belçika çikolatalı kruvasan ve özel tarifli tatlılarımızla damağınızda unutulmaz bir iz bırakıyoruz.',
    about_image_1 TEXT DEFAULT 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    about_image_2 TEXT DEFAULT 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80',
    address TEXT DEFAULT 'Dumlupınar, Sahaf Sk No:3 D:A, 34000 Pendik/İstanbul',
    phone VARCHAR(50) DEFAULT '0501 558 09 58',
    phone_raw VARCHAR(50) DEFAULT '05015580958',
    working_hours VARCHAR(100) DEFAULT 'Her Gün: 09:00 - 23:30',
    maps_url TEXT DEFAULT 'https://maps.app.goo.gl/a2nsSuwbPQ1amwEe7',
    instagram_url TEXT DEFAULT 'https://instagram.com/',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow full site_settings access" ON site_settings FOR ALL USING (true);
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

