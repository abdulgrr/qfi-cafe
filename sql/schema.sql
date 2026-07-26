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
