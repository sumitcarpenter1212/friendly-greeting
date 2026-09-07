CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL DEFAULT '',
  category text NOT NULL,
  price integer NOT NULL,
  old_price integer,
  discount integer NOT NULL DEFAULT 0,
  rating numeric(2,1) NOT NULL DEFAULT 4.0,
  ratings_count integer NOT NULL DEFAULT 0,
  image_url text,
  assured boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.products (name, brand, category, price, old_price, discount, rating, ratings_count, assured, featured) VALUES
('Galaxy M35 5G (Thunder Grey, 128 GB)', 'Samsung', 'Mobiles', 14999, 22999, 34, 4.3, 24518, true, true),
('iPhone 15 (Black, 128 GB)', 'Apple', 'Mobiles', 58999, 79900, 26, 4.6, 91240, true, true),
('Redmi Note 14 5G (Phantom Purple, 256 GB)', 'Redmi', 'Mobiles', 17499, 21999, 20, 4.2, 43110, true, true),
('Nord CE4 Lite 5G (Super Silver, 128 GB)', 'OnePlus', 'Mobiles', 19999, 24999, 20, 4.4, 18902, true, false),
('Vivo T3x 5G (Celestial Green, 128 GB)', 'Vivo', 'Mobiles', 12499, 16999, 26, 4.1, 30112, false, false),
('Victus Gaming Ryzen 5 (16 GB / 512 GB SSD)', 'HP', 'Laptops', 54990, 74999, 26, 4.3, 5120, true, true),
('MacBook Air M2 (8 GB / 256 GB SSD)', 'Apple', 'Laptops', 79990, 99900, 19, 4.7, 12980, true, true),
('IdeaPad Slim 3 i5 (16 GB / 512 GB SSD)', 'Lenovo', 'Laptops', 48990, 66990, 26, 4.2, 8341, true, false),
('Vostro 3520 i3 (8 GB / 512 GB SSD)', 'Dell', 'Laptops', 36990, 51999, 28, 4.0, 3921, false, false),
('Regular Fit Cotton Casual Shirt', 'Roadster', 'Fashion', 649, 1999, 67, 4.1, 15230, false, true),
('Slim Fit Stretchable Denim Jeans', 'Levis', 'Fashion', 1499, 3499, 57, 4.3, 8845, true, true),
('Running Sports Shoes For Men', 'Puma', 'Fashion', 1899, 4499, 57, 4.2, 21094, true, false),
('Printed Round Neck Cotton T-Shirt', 'HRX', 'Fashion', 399, 1299, 69, 4.0, 33120, false, false),
('Anarkali Rayon Kurta Set', 'Libas', 'Fashion', 999, 2999, 66, 4.2, 9412, false, false),
('Bluetooth 5.3 Wireless Earbuds', 'boAt', 'Electronics', 1099, 3990, 72, 4.1, 61240, true, true),
('108 cm (43 inch) 4K Ultra HD Smart TV', 'Mi', 'Electronics', 24999, 39999, 37, 4.4, 14220, true, true),
('Smart Watch with AMOLED Display', 'Noise', 'Electronics', 1499, 5999, 75, 4.0, 42310, false, false),
('20000 mAh Fast Charging Power Bank', 'Mi', 'Electronics', 1799, 2999, 40, 4.3, 28110, true, false),
('7 kg Fully Automatic Washing Machine', 'LG', 'Appliances', 16490, 22990, 28, 4.4, 6210, true, true),
('1.5 Ton 3 Star Split Inverter AC', 'Voltas', 'Appliances', 32990, 48990, 32, 4.2, 4120, true, false),
('253 L Double Door Refrigerator', 'Samsung', 'Appliances', 25990, 33900, 23, 4.3, 5390, true, false),
('Non-Stick Cookware Set (4 Pieces)', 'Prestige', 'Home', 1299, 2999, 56, 4.1, 11230, false, true),
('Double Bed Cotton Bedsheet with 2 Pillow Covers', 'Story@Home', 'Home', 549, 1799, 69, 4.0, 19340, false, false),
('Solid Wood 2 Door Wardrobe', 'Nilkamal', 'Home', 8499, 14999, 43, 4.0, 1820, false, false),
('Daily Grocery Combo Pack', 'Fortune', 'Grocery', 899, 1299, 30, 4.2, 7420, false, false),
('Vitamin C Face Wash 150 ml', 'Mamaearth', 'Beauty', 249, 399, 37, 4.3, 25110, false, false);