-- ===================================================
-- SITE SETTINGS & CMS CONTENT TABLE
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cmcfnufmsqprwkmnwhbj/sql
-- ===================================================

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

-- Enable RLS & policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow full site_settings access" ON site_settings FOR ALL USING (true);

-- Insert initial row id 1
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
