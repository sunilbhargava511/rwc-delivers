-- RWC Delivers — Seed Data
-- All 15 Redwood City partner restaurants with real menu data
-- Prices in cents

-- ============================================================
-- DELIVERY ZONE (Downtown Redwood City ~3 mile radius)
-- ============================================================

INSERT INTO delivery_zones (id, name, polygon, is_active) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Downtown Redwood City',
  '{"type":"Polygon","coordinates":[[[-122.2800,37.5100],[-122.1950,37.5100],[-122.1950,37.4550],[-122.2800,37.4550],[-122.2800,37.5100]]]}',
  true
);

-- ============================================================
-- RESTAURANTS
-- ============================================================

-- 1. La Viga
INSERT INTO restaurants (id, slug, name, description, cuisine_tags, address, phone, lat, lng, rating, review_count, price_range, default_prep_time_min) VALUES
('10000000-0000-0000-0000-000000000001', 'la-viga', 'La Viga Seafood & Cocina Mexicana', 'Named after La Viga, Mexico City''s massive seafood market. Coastal Mexican flavors with modern California touches. MICHELIN Recommended since 2015.', ARRAY['Mexican','Seafood'], '1772 Broadway', '(650) 679-8141', 37.4863, -122.2275, 4.2, 2008, '$$', 30);

-- 2. MAZRA
INSERT INTO restaurants (id, slug, name, description, cuisine_tags, address, phone, lat, lng, rating, review_count, price_range, default_prep_time_min) VALUES
('10000000-0000-0000-0000-000000000002', 'mazra', 'MAZRA', 'Authentic Levantine and Mediterranean dishes prepared over 100% mesquite wood fire. Tapas-style, vibrant, meant to be shared. James Beard Semifinalist 2025.', ARRAY['Mediterranean','BBQ'], '2021 Broadway Street', '(650) 503-8440', 37.4879, -122.2297, 4.5, 1043, '$$', 25);

-- 3. Nomadic Kitchen
INSERT INTO restaurants (id, slug, name, description, cuisine_tags, address, phone, lat, lng, rating, review_count, price_range, default_prep_time_min) VALUES
('10000000-0000-0000-0000-000000000003', 'nomadic-kitchen', 'Nomadic Kitchen', 'Turkish cuisine with the highest Yelp rating in Redwood City. Authentic flavors featuring pides, kebabs, and mezze.', ARRAY['Turkish','Mediterranean'], '2086 Broadway', '(650) 362-4594', 37.4882, -122.2301, 4.9, 240, '$$', 25);

-- 4. Vesta
INSERT INTO restaurants (id, slug, name, description, cuisine_tags, address, phone, lat, lng, rating, review_count, price_range, default_prep_time_min) VALUES
('10000000-0000-0000-0000-000000000004', 'vesta', 'Vesta', 'Handcrafted wood-fired pizzas and dynamic small plates since 2012. Quirky Neapolitan pizzas with California-influenced toppings.', ARRAY['Pizza','Italian'], '2022 Broadway', '(650) 362-5052', 37.4878, -122.2296, 4.5, 2611, '$$', 20);

-- 5. Timber & Salt
INSERT INTO restaurants (id, slug, name, description, cuisine_tags, address, phone, lat, lng, rating, review_count, price_range, default_prep_time_min) VALUES
('10000000-0000-0000-0000-000000000005', 'timber-and-salt', 'Timber & Salt', 'New American steaks and craft cocktails. Seasonal California comfort food in an upscale yet approachable setting.', ARRAY['American','Steaks'], '881 Middlefield Rd', '(650) 362-3777', 37.4815, -122.2321, 4.5, 536, '$$$', 35);

-- 6. Donato Enoteca
INSERT INTO restaurants (id, slug, name, description, cuisine_tags, address, phone, lat, lng, rating, review_count, price_range, default_prep_time_min) VALUES
('10000000-0000-0000-0000-000000000006', 'donato-enoteca', 'Donato Enoteca', 'Modern Italian wine bar featuring handmade pastas, wood-fired dishes, and an extensive Italian wine list. Weekly rotating menus.', ARRAY['Italian','Wine Bar'], '1041 Middlefield Road', '(650) 701-1000', 37.4826, -122.2328, 3.8, 1107, '$$-$$$', 30);

-- 7. Angelicas
INSERT INTO restaurants (id, slug, name, description, cuisine_tags, address, phone, lat, lng, rating, review_count, price_range, default_prep_time_min) VALUES
('10000000-0000-0000-0000-000000000007', 'angelicas', 'Angelicas', 'California-Latin fusion on Main Street. Vibrant flavors, fresh ingredients, and creative cocktails in a lively atmosphere.', ARRAY['California','Latin'], '863 Main Street', '(650) 679-8184', 37.4845, -122.2299, 4.2, 1395, '$$-$$$', 30);

-- 8. Broadway Masala
INSERT INTO restaurants (id, slug, name, description, cuisine_tags, address, phone, lat, lng, rating, review_count, price_range, default_prep_time_min) VALUES
('10000000-0000-0000-0000-000000000008', 'broadway-masala', 'Broadway Masala', 'Regional Indian cuisine recognized by the Michelin Guide four times. Authentic spices and traditional recipes.', ARRAY['Indian'], '2397 Broadway St', '(650) 369-9000', 37.4897, -122.2324, 4.3, 1112, '$$', 25);

-- 9. Hurrica
INSERT INTO restaurants (id, slug, name, description, cuisine_tags, address, phone, lat, lng, rating, review_count, price_range, default_prep_time_min) VALUES
('10000000-0000-0000-0000-000000000009', 'hurrica', 'Hurrica', 'Seafood and live-fire hearth cooking on the waterfront. TripAdvisor #1 in Redwood City, top 1% worldwide.', ARRAY['Seafood','American'], '150 Northpoint Ct', '(650) 499-4858', 37.4960, -122.2280, 4.4, 524, '$$$', 35);

-- 10. Pamilya
INSERT INTO restaurants (id, slug, name, description, cuisine_tags, address, phone, lat, lng, rating, review_count, price_range, default_prep_time_min) VALUES
('10000000-0000-0000-0000-000000000010', 'pamilya', 'Pamilya', 'Authentic Filipino cuisine bringing family recipes to Redwood City. Comforting, flavorful dishes from the Philippines.', ARRAY['Filipino'], '756 Woodside Rd', '(650) 362-4166', 37.4605, -122.2349, 4.5, 119, '$$', 25);

-- 11. La Fonda
INSERT INTO restaurants (id, slug, name, description, cuisine_tags, address, phone, lat, lng, rating, review_count, price_range, default_prep_time_min) VALUES
('10000000-0000-0000-0000-000000000011', 'la-fonda', 'La Fonda De Los Carnalitos', 'Authentic Mexico City-style Mexican cuisine. Traditional family recipes with signature mole poblano.', ARRAY['Mexican'], '820 Veterans Blvd', '(650) 362-3069', 37.4790, -122.2195, 4.5, 323, '$$', 25);

-- 12. Pizzeria Cardamomo
INSERT INTO restaurants (id, slug, name, description, cuisine_tags, address, phone, lat, lng, rating, review_count, price_range, default_prep_time_min) VALUES
('10000000-0000-0000-0000-000000000012', 'pizzeria-cardamomo', 'Pizzeria Cardamomo', 'Neapolitan-style sourdough pizza and handmade pasta on Broadway. Traditional Italian recipes with a modern touch.', ARRAY['Italian','Pizza'], '2053A Broadway', '(650) 629-4193', 37.4880, -122.2298, 4.5, 239, '$$', 20);

-- 13. Mistral
INSERT INTO restaurants (id, slug, name, description, cuisine_tags, address, phone, lat, lng, rating, review_count, price_range, default_prep_time_min) VALUES
('10000000-0000-0000-0000-000000000013', 'mistral', 'Mistral', 'Mediterranean-influenced New American on the waterfront with stunning views. Oak-fired pizzas and seasonal menus.', ARRAY['American','Fine Dining'], '370 Bridge Parkway', '(650) 802-9222', 37.5020, -122.2240, 4.2, 618, '$$$', 40);

-- 14. BAO
INSERT INTO restaurants (id, slug, name, description, cuisine_tags, address, phone, lat, lng, rating, review_count, price_range, default_prep_time_min) VALUES
('10000000-0000-0000-0000-000000000014', 'bao', 'BAO', 'Cantonese dim sum and traditional Chinese dishes on Broadway. Handmade dumplings, bao, and classic favorites.', ARRAY['Chinese','Dim Sum'], '2050 Broadway', '(650) 257-7058', 37.4879, -122.2297, 4.0, 208, '$$', 20);

-- 15. Limon
INSERT INTO restaurants (id, slug, name, description, cuisine_tags, address, phone, lat, lng, rating, review_count, price_range, default_prep_time_min) VALUES
('10000000-0000-0000-0000-000000000015', 'limon', 'Limon', 'Peruvian cuisine featuring ceviche, rotisserie chicken, lomo saltado, and traditional dishes from Peru.', ARRAY['Peruvian'], '885 Middlefield Rd', '(650) 502-8800', 37.4816, -122.2322, 4.0, 226, '$$', 25);

-- ============================================================
-- RESTAURANT HOURS
-- day_of_week: 0=Sunday, 1=Monday ... 6=Saturday
-- ============================================================

-- La Viga: Mon-Thu 11:30-14:30 + 16:30-20:30, Fri 11:30-21:30, Sat 11:30-21:30, Sun 11:30-20:00
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES
('10000000-0000-0000-0000-000000000001', 0, '11:30', '20:00'),
('10000000-0000-0000-0000-000000000001', 1, '11:30', '14:30'),
('10000000-0000-0000-0000-000000000001', 1, '16:30', '20:30'),
('10000000-0000-0000-0000-000000000001', 2, '11:30', '14:30'),
('10000000-0000-0000-0000-000000000001', 2, '16:30', '20:30'),
('10000000-0000-0000-0000-000000000001', 3, '11:30', '14:30'),
('10000000-0000-0000-0000-000000000001', 3, '16:30', '20:30'),
('10000000-0000-0000-0000-000000000001', 4, '11:30', '14:30'),
('10000000-0000-0000-0000-000000000001', 4, '16:30', '20:30'),
('10000000-0000-0000-0000-000000000001', 5, '11:30', '21:30'),
('10000000-0000-0000-0000-000000000001', 6, '11:30', '21:30');

-- MAZRA: Closed Monday, Tue-Sun 11:00-21:00
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES
('10000000-0000-0000-0000-000000000002', 0, '11:00', '21:00'),
('10000000-0000-0000-0000-000000000002', 2, '11:00', '21:00'),
('10000000-0000-0000-0000-000000000002', 3, '11:00', '21:00'),
('10000000-0000-0000-0000-000000000002', 4, '11:00', '21:00'),
('10000000-0000-0000-0000-000000000002', 5, '11:00', '21:00'),
('10000000-0000-0000-0000-000000000002', 6, '11:00', '21:00');

-- Nomadic Kitchen: Closed Tuesday, Mon+Wed-Sun 11:00-21:00
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES
('10000000-0000-0000-0000-000000000003', 0, '11:00', '21:00'),
('10000000-0000-0000-0000-000000000003', 1, '11:00', '21:00'),
('10000000-0000-0000-0000-000000000003', 3, '11:00', '21:00'),
('10000000-0000-0000-0000-000000000003', 4, '11:00', '21:00'),
('10000000-0000-0000-0000-000000000003', 5, '11:00', '21:00'),
('10000000-0000-0000-0000-000000000003', 6, '11:00', '21:00');

-- Vesta: Closed Sunday, Mon-Sat 11:00-21:00
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES
('10000000-0000-0000-0000-000000000004', 1, '11:00', '21:00'),
('10000000-0000-0000-0000-000000000004', 2, '11:00', '21:00'),
('10000000-0000-0000-0000-000000000004', 3, '11:00', '21:00'),
('10000000-0000-0000-0000-000000000004', 4, '11:00', '21:00'),
('10000000-0000-0000-0000-000000000004', 5, '11:00', '21:00'),
('10000000-0000-0000-0000-000000000004', 6, '11:00', '21:00');

-- Timber & Salt: Closed Mon+Sun, Tue-Thu 11:30-14:30+17:00-21:00, Fri 11:30-14:30+17:00-22:00, Sat 17:00-22:00
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES
('10000000-0000-0000-0000-000000000005', 2, '11:30', '14:30'),
('10000000-0000-0000-0000-000000000005', 2, '17:00', '21:00'),
('10000000-0000-0000-0000-000000000005', 3, '11:30', '14:30'),
('10000000-0000-0000-0000-000000000005', 3, '17:00', '21:00'),
('10000000-0000-0000-0000-000000000005', 4, '11:30', '14:30'),
('10000000-0000-0000-0000-000000000005', 4, '17:00', '21:00'),
('10000000-0000-0000-0000-000000000005', 5, '11:30', '14:30'),
('10000000-0000-0000-0000-000000000005', 5, '17:00', '22:00'),
('10000000-0000-0000-0000-000000000005', 6, '17:00', '22:00');

-- Donato Enoteca: Mon-Thu 11:30-14:00+17:00-21:00, Fri-Sat 11:30-16:00+17:00-21:45, Sun 11:30-16:00+17:00-21:00
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES
('10000000-0000-0000-0000-000000000006', 0, '11:30', '16:00'),
('10000000-0000-0000-0000-000000000006', 0, '17:00', '21:00'),
('10000000-0000-0000-0000-000000000006', 1, '11:30', '14:00'),
('10000000-0000-0000-0000-000000000006', 1, '17:00', '21:00'),
('10000000-0000-0000-0000-000000000006', 2, '11:30', '14:00'),
('10000000-0000-0000-0000-000000000006', 2, '17:00', '21:00'),
('10000000-0000-0000-0000-000000000006', 3, '11:30', '14:00'),
('10000000-0000-0000-0000-000000000006', 3, '17:00', '21:00'),
('10000000-0000-0000-0000-000000000006', 4, '11:30', '14:00'),
('10000000-0000-0000-0000-000000000006', 4, '17:00', '21:00'),
('10000000-0000-0000-0000-000000000006', 5, '11:30', '16:00'),
('10000000-0000-0000-0000-000000000006', 5, '17:00', '21:45'),
('10000000-0000-0000-0000-000000000006', 6, '11:30', '16:00'),
('10000000-0000-0000-0000-000000000006', 6, '17:00', '21:45');

-- Angelicas: Closed Mon, Tue-Fri 08:00-14:30+16:00-21:00(21:30 Fri-Sat), Sat-Sun brunch+dinner
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES
('10000000-0000-0000-0000-000000000007', 0, '08:00', '14:00'),
('10000000-0000-0000-0000-000000000007', 0, '16:00', '20:00'),
('10000000-0000-0000-0000-000000000007', 2, '08:00', '14:30'),
('10000000-0000-0000-0000-000000000007', 2, '16:00', '21:00'),
('10000000-0000-0000-0000-000000000007', 3, '08:00', '14:30'),
('10000000-0000-0000-0000-000000000007', 3, '16:00', '21:00'),
('10000000-0000-0000-0000-000000000007', 4, '08:00', '14:30'),
('10000000-0000-0000-0000-000000000007', 4, '16:00', '21:00'),
('10000000-0000-0000-0000-000000000007', 5, '08:00', '14:30'),
('10000000-0000-0000-0000-000000000007', 5, '16:00', '21:30'),
('10000000-0000-0000-0000-000000000007', 6, '08:00', '14:30'),
('10000000-0000-0000-0000-000000000007', 6, '16:00', '21:30');

-- Broadway Masala: Mon-Thu 11:30-14:30+17:00-21:30, Fri 11:30-14:30+17:00-22:00, Sat 11:30-15:00+17:00-22:00, Sun 11:30-15:00+17:00-21:30
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES
('10000000-0000-0000-0000-000000000008', 0, '11:30', '15:00'),
('10000000-0000-0000-0000-000000000008', 0, '17:00', '21:30'),
('10000000-0000-0000-0000-000000000008', 1, '11:30', '14:30'),
('10000000-0000-0000-0000-000000000008', 1, '17:00', '21:30'),
('10000000-0000-0000-0000-000000000008', 2, '11:30', '14:30'),
('10000000-0000-0000-0000-000000000008', 2, '17:00', '21:30'),
('10000000-0000-0000-0000-000000000008', 3, '11:30', '14:30'),
('10000000-0000-0000-0000-000000000008', 3, '17:00', '21:30'),
('10000000-0000-0000-0000-000000000008', 4, '11:30', '14:30'),
('10000000-0000-0000-0000-000000000008', 4, '17:00', '21:30'),
('10000000-0000-0000-0000-000000000008', 5, '11:30', '14:30'),
('10000000-0000-0000-0000-000000000008', 5, '17:00', '22:00'),
('10000000-0000-0000-0000-000000000008', 6, '11:30', '15:00'),
('10000000-0000-0000-0000-000000000008', 6, '17:00', '22:00');

-- Hurrica: Wed-Sun, dinner hours vary
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES
('10000000-0000-0000-0000-000000000009', 0, '11:00', '20:30'),
('10000000-0000-0000-0000-000000000009', 3, '11:00', '20:30'),
('10000000-0000-0000-0000-000000000009', 4, '11:00', '21:30'),
('10000000-0000-0000-0000-000000000009', 5, '11:00', '21:30'),
('10000000-0000-0000-0000-000000000009', 6, '11:00', '21:30');

-- Pamilya: Closed Mon, Tue-Sun 11:00-20:00
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES
('10000000-0000-0000-0000-000000000010', 0, '11:00', '20:00'),
('10000000-0000-0000-0000-000000000010', 2, '11:00', '20:00'),
('10000000-0000-0000-0000-000000000010', 3, '11:00', '20:00'),
('10000000-0000-0000-0000-000000000010', 4, '11:00', '20:00'),
('10000000-0000-0000-0000-000000000010', 5, '11:00', '20:00'),
('10000000-0000-0000-0000-000000000010', 6, '11:00', '20:00');

-- La Fonda: Mon-Sat 10:00-21:00, Sun 10:00-22:00
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES
('10000000-0000-0000-0000-000000000011', 0, '10:00', '22:00'),
('10000000-0000-0000-0000-000000000011', 1, '10:00', '21:00'),
('10000000-0000-0000-0000-000000000011', 2, '10:00', '21:00'),
('10000000-0000-0000-0000-000000000011', 3, '10:00', '21:00'),
('10000000-0000-0000-0000-000000000011', 4, '10:00', '21:00'),
('10000000-0000-0000-0000-000000000011', 5, '10:00', '21:00'),
('10000000-0000-0000-0000-000000000011', 6, '10:00', '21:00');

-- Pizzeria Cardamomo: Closed Mon, Tue-Thu 11:00-15:00+17:00-21:00, Fri-Sat 11:00-22:00, Sun 11:00-21:00
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES
('10000000-0000-0000-0000-000000000012', 0, '11:00', '21:00'),
('10000000-0000-0000-0000-000000000012', 2, '11:00', '15:00'),
('10000000-0000-0000-0000-000000000012', 2, '17:00', '21:00'),
('10000000-0000-0000-0000-000000000012', 3, '11:00', '15:00'),
('10000000-0000-0000-0000-000000000012', 3, '17:00', '21:00'),
('10000000-0000-0000-0000-000000000012', 4, '11:00', '15:00'),
('10000000-0000-0000-0000-000000000012', 4, '17:00', '21:00'),
('10000000-0000-0000-0000-000000000012', 5, '11:00', '22:00'),
('10000000-0000-0000-0000-000000000012', 6, '11:00', '22:00');

-- Mistral: Closed Sun, Mon-Thu 16:30-20:00, Fri-Sat 16:30-21:00
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES
('10000000-0000-0000-0000-000000000013', 1, '16:30', '20:00'),
('10000000-0000-0000-0000-000000000013', 2, '16:30', '20:00'),
('10000000-0000-0000-0000-000000000013', 3, '16:30', '20:00'),
('10000000-0000-0000-0000-000000000013', 4, '16:30', '20:00'),
('10000000-0000-0000-0000-000000000013', 5, '16:30', '21:00'),
('10000000-0000-0000-0000-000000000013', 6, '16:30', '21:00');

-- BAO: Daily 11:30-14:30+17:00-21:30
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES
('10000000-0000-0000-0000-000000000014', 0, '11:30', '14:30'),
('10000000-0000-0000-0000-000000000014', 0, '17:00', '21:30'),
('10000000-0000-0000-0000-000000000014', 1, '11:30', '14:30'),
('10000000-0000-0000-0000-000000000014', 1, '17:00', '21:30'),
('10000000-0000-0000-0000-000000000014', 2, '11:30', '14:30'),
('10000000-0000-0000-0000-000000000014', 2, '17:00', '21:30'),
('10000000-0000-0000-0000-000000000014', 3, '11:30', '14:30'),
('10000000-0000-0000-0000-000000000014', 3, '17:00', '21:30'),
('10000000-0000-0000-0000-000000000014', 4, '11:30', '14:30'),
('10000000-0000-0000-0000-000000000014', 4, '17:00', '21:30'),
('10000000-0000-0000-0000-000000000014', 5, '11:30', '14:30'),
('10000000-0000-0000-0000-000000000014', 5, '17:00', '21:30'),
('10000000-0000-0000-0000-000000000014', 6, '11:30', '14:30'),
('10000000-0000-0000-0000-000000000014', 6, '17:00', '21:30');

-- Limon: Sun-Thu 11:30-21:30, Fri-Sat 11:30-22:30
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES
('10000000-0000-0000-0000-000000000015', 0, '11:30', '21:30'),
('10000000-0000-0000-0000-000000000015', 1, '11:30', '21:30'),
('10000000-0000-0000-0000-000000000015', 2, '11:30', '21:30'),
('10000000-0000-0000-0000-000000000015', 3, '11:30', '21:30'),
('10000000-0000-0000-0000-000000000015', 4, '11:30', '21:30'),
('10000000-0000-0000-0000-000000000015', 5, '11:30', '22:30'),
('10000000-0000-0000-0000-000000000015', 6, '11:30', '22:30');

-- ============================================================
-- MENU CATEGORIES AND ITEMS
-- All prices in cents
-- ============================================================

-- ---- LA VIGA ----
INSERT INTO menu_categories (id, restaurant_id, name, sort_order) VALUES
('c1000001', '10000000-0000-0000-0000-000000000001', 'Appetizers', 0),
('c1000002', '10000000-0000-0000-0000-000000000001', 'Tacos', 1),
('c1000003', '10000000-0000-0000-0000-000000000001', 'Enchiladas', 2),
('c1000004', '10000000-0000-0000-0000-000000000001', 'Entrees', 3);

INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, sort_order) VALUES
('m1000001', '10000000-0000-0000-0000-000000000001', 'c1000001', 'Guacamole', 'Ripe avocado, onions, cilantro, serrano, tomato, lime juice, queso fresco, totopos & chile de arbol sauce', 800, 0),
('m1000002', '10000000-0000-0000-0000-000000000001', 'c1000001', 'Sampler Platter', 'Empanada de mariscos, crispy coconut prawn, side of fried calamari', 1900, 1),
('m1000003', '10000000-0000-0000-0000-000000000001', 'c1000001', 'Sauteed Octopus', 'Octopus, calamari, chorizo, fennel with chile arbol sauce, served over toasted bread and black bean spread', 1200, 2),
('m1000004', '10000000-0000-0000-0000-000000000001', 'c1000002', 'Tacos (3)', 'Homemade corn tortillas with your choice of protein', 1500, 0),
('m1000005', '10000000-0000-0000-0000-000000000001', 'c1000003', 'Veggie Enchiladas', '2 homemade tortillas, guajillo enchilada sauce, queso fresco, cream, cheese, rice & black bean puree', 1800, 0),
('m1000006', '10000000-0000-0000-0000-000000000001', 'c1000003', 'Steak Enchiladas', 'Same preparation with steak', 2500, 1),
('m1000007', '10000000-0000-0000-0000-000000000001', 'c1000003', 'Shrimp Enchiladas', 'Same preparation with shrimp', 2700, 2),
('m1000008', '10000000-0000-0000-0000-000000000001', 'c1000003', 'Seafood Enchiladas', 'Same preparation with mixed seafood', 2900, 3),
('m1000009', '10000000-0000-0000-0000-000000000001', 'c1000004', 'Grilled Skirt Steak', 'With poblano garlic mashed potatoes, brussels sprouts, chimichurri sauce', 3000, 0),
('m1000010', '10000000-0000-0000-0000-000000000001', 'c1000004', 'Blackened Atlantic Salmon', 'Salmon filet with butternut squash', 2900, 1),
('m1000011', '10000000-0000-0000-0000-000000000001', 'c1000004', 'Grilled Wild Mahi-Mahi', 'Mahi-mahi fillet', 3000, 2);

-- Taco protein modifier
INSERT INTO modifier_groups (id, menu_item_id, name, is_required, min_selections, max_selections) VALUES
('mg100001', 'm1000004', 'Choose Protein', true, 1, 1);
INSERT INTO modifier_options (modifier_group_id, name, price_delta, sort_order) VALUES
('mg100001', 'Asada', 0, 0),
('mg100001', 'Cochinita', 0, 1),
('mg100001', 'Pollo', 0, 2),
('mg100001', 'Camaron', 200, 3),
('mg100001', 'Pescado', 200, 4),
('mg100001', 'Salmon', 400, 5);

-- ---- MAZRA ----
INSERT INTO menu_categories (id, restaurant_id, name, sort_order) VALUES
('c2000001', '10000000-0000-0000-0000-000000000002', 'Appetizers / Mezza', 0),
('c2000002', '10000000-0000-0000-0000-000000000002', 'Wraps', 1),
('c2000003', '10000000-0000-0000-0000-000000000002', 'Plates', 2),
('c2000004', '10000000-0000-0000-0000-000000000002', 'Beverages', 3);

INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, sort_order) VALUES
('m2000001', '10000000-0000-0000-0000-000000000002', 'c2000001', 'Heirloom Cauliflower', 'With lemon tahini dressing', 1400, 0),
('m2000002', '10000000-0000-0000-0000-000000000002', 'c2000001', 'Falafel', 'Freshly ground chickpeas, herbs & spices; served with hot sauce & tahini', 1200, 1),
('m2000003', '10000000-0000-0000-0000-000000000002', 'c2000001', 'Halloumi Rolls', 'Halloumi cheese wrapped in phyllo pastry dough, served with spiced honey', 1400, 2),
('m2000004', '10000000-0000-0000-0000-000000000002', 'c2000002', 'Chicken Shawarma Wrap', 'With tzatziki, tomato, onions, pickles & fries', 1600, 0),
('m2000005', '10000000-0000-0000-0000-000000000002', 'c2000003', 'Chicken Shawarma Plate', 'Crispy thin slices of chicken with basmati rice, hot sauce, garlic toum sauce, pita bread & 2 sides', 2400, 0),
('m2000006', '10000000-0000-0000-0000-000000000002', 'c2000003', 'Double Kebab Plate', 'Beef and lamb kebab (signature)', 2800, 1),
('m2000007', '10000000-0000-0000-0000-000000000002', 'c2000003', 'Grilled Salmon Plate', 'Grilled salmon with basmati rice and sides', 3500, 2),
('m2000008', '10000000-0000-0000-0000-000000000002', 'c2000004', 'Mint Lemonade', 'Refreshing house-made mint lemonade', 600, 0);

-- ---- NOMADIC KITCHEN ----
INSERT INTO menu_categories (id, restaurant_id, name, sort_order) VALUES
('c3000001', '10000000-0000-0000-0000-000000000003', 'Salads & Soups', 0),
('c3000002', '10000000-0000-0000-0000-000000000003', 'Mezze', 1),
('c3000003', '10000000-0000-0000-0000-000000000003', 'Pides', 2),
('c3000004', '10000000-0000-0000-0000-000000000003', 'Kebabs', 3),
('c3000005', '10000000-0000-0000-0000-000000000003', 'Desserts', 4);

INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, sort_order) VALUES
('m3000001', '10000000-0000-0000-0000-000000000003', 'c3000001', 'Red Lentil Soup', 'Traditional Turkish lentil soup', 950, 0),
('m3000002', '10000000-0000-0000-0000-000000000003', 'c3000001', 'Chickpea Salad', 'Fresh chickpea salad', 950, 1),
('m3000003', '10000000-0000-0000-0000-000000000003', 'c3000002', 'Hummus', 'Classic hummus', 1010, 0),
('m3000004', '10000000-0000-0000-0000-000000000003', 'c3000002', 'Babaganoush', 'Smoky roasted eggplant dip', 1010, 1),
('m3000005', '10000000-0000-0000-0000-000000000003', 'c3000002', 'Mezze Combination', 'Four spreads with pita', 1725, 2),
('m3000006', '10000000-0000-0000-0000-000000000003', 'c3000003', 'Cheese Pide', 'Turkish flatbread with cheese', 1665, 0),
('m3000007', '10000000-0000-0000-0000-000000000003', 'c3000003', 'Spicy Spinach Pide', 'Turkish flatbread with spicy spinach', 1965, 1),
('m3000008', '10000000-0000-0000-0000-000000000003', 'c3000003', 'Turkish Sucuk & Cheese Pide', 'With spiced sausage and cheese', 1845, 2),
('m3000009', '10000000-0000-0000-0000-000000000003', 'c3000004', 'Chicken Kebab', 'With salad and rice', 2250, 0),
('m3000010', '10000000-0000-0000-0000-000000000003', 'c3000004', 'Kofte Kebab', 'With salad and rice', 2450, 1),
('m3000011', '10000000-0000-0000-0000-000000000003', 'c3000004', 'Lamb Kebab', 'With salad and rice', 2450, 2),
('m3000012', '10000000-0000-0000-0000-000000000003', 'c3000005', 'Rice Pudding', 'Traditional Turkish rice pudding', 715, 0);

-- ---- VESTA ----
INSERT INTO menu_categories (id, restaurant_id, name, sort_order) VALUES
('c4000001', '10000000-0000-0000-0000-000000000004', 'Small Plates', 0),
('c4000002', '10000000-0000-0000-0000-000000000004', 'Red Pies', 1),
('c4000003', '10000000-0000-0000-0000-000000000004', 'White Pies', 2),
('c4000004', '10000000-0000-0000-0000-000000000004', 'Desserts', 3);

INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, sort_order) VALUES
('m4000001', '10000000-0000-0000-0000-000000000004', 'c4000001', 'Grilled Carrots', 'Cilantro, paprika, cumin, garlic, lemon yogurt', 1000, 0),
('m4000002', '10000000-0000-0000-0000-000000000004', 'c4000001', 'Burrata Plate', 'Fresh burrata, fleur de sel, grilled bread', 1300, 1),
('m4000003', '10000000-0000-0000-0000-000000000004', 'c4000001', 'Pork Meatballs', 'Arugula, jalapeno aioli, parmigiano reggiano', 1400, 2),
('m4000004', '10000000-0000-0000-0000-000000000004', 'c4000001', 'Charcuterie', 'Salame rosa, soppressata, prosciutto americano, marinated olives', 1600, 3),
('m4000005', '10000000-0000-0000-0000-000000000004', 'c4000002', 'Margherita', 'Tomato sauce, fresh mozzarella, basil, olive oil', 2100, 0),
('m4000006', '10000000-0000-0000-0000-000000000004', 'c4000002', 'Pepperoni', 'Tomato sauce, pepperoni, fresh mozzarella, calabrian chili honey', 2700, 1),
('m4000007', '10000000-0000-0000-0000-000000000004', 'c4000002', 'Sausage & Honey', 'Spicy Italian sausage, mascarpone, honey, serrano chili (SIGNATURE)', 2700, 2),
('m4000008', '10000000-0000-0000-0000-000000000004', 'c4000003', 'Carbonara', 'Mascarpone, pecorino, farm egg, applewood smoked bacon', 2300, 0),
('m4000009', '10000000-0000-0000-0000-000000000004', 'c4000004', 'Mexican Chocolate Bread Pudding', 'Rich chocolate bread pudding', 1000, 0),
('m4000010', '10000000-0000-0000-0000-000000000004', 'c4000004', 'Basque Cheesecake', 'Burnt Basque-style cheesecake', 1300, 1);

-- ---- TIMBER & SALT ----
INSERT INTO menu_categories (id, restaurant_id, name, sort_order) VALUES
('c5000001', '10000000-0000-0000-0000-000000000005', 'Starters', 0),
('c5000002', '10000000-0000-0000-0000-000000000005', 'Entrees', 1),
('c5000003', '10000000-0000-0000-0000-000000000005', 'Desserts', 2);

INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, sort_order) VALUES
('m5000001', '10000000-0000-0000-0000-000000000005', 'c5000001', 'Warm Marinated Olives', '', 600, 0),
('m5000002', '10000000-0000-0000-0000-000000000005', 'c5000001', 'Kennebec Fries', '', 700, 1),
('m5000003', '10000000-0000-0000-0000-000000000005', 'c5000001', 'Buffalo Cauliflower', '', 1300, 2),
('m5000004', '10000000-0000-0000-0000-000000000005', 'c5000001', 'Blackened Gulf Shrimp Tacos (2)', '', 1300, 3),
('m5000005', '10000000-0000-0000-0000-000000000005', 'c5000002', 'Timber & Salt Burger', '', 2400, 0),
('m5000006', '10000000-0000-0000-0000-000000000005', 'c5000002', 'Curried Fried Chicken', '', 2900, 1),
('m5000007', '10000000-0000-0000-0000-000000000005', 'c5000002', 'Petit Filet Mignon', '', 3800, 2),
('m5000008', '10000000-0000-0000-0000-000000000005', 'c5000002', 'Center Cut Norwegian Salmon', '', 3800, 3),
('m5000009', '10000000-0000-0000-0000-000000000005', 'c5000003', 'Chocolate Chip Cheesecake', '', 1400, 0),
('m5000010', '10000000-0000-0000-0000-000000000005', 'c5000003', 'Chocolate Brownie', 'With vanilla ice cream', 1200, 1);

-- ---- DONATO ENOTECA ----
INSERT INTO menu_categories (id, restaurant_id, name, sort_order) VALUES
('c6000001', '10000000-0000-0000-0000-000000000006', 'Lunch', 0),
('c6000002', '10000000-0000-0000-0000-000000000006', 'Dinner', 1),
('c6000003', '10000000-0000-0000-0000-000000000006', 'Desserts', 2);

INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, sort_order) VALUES
('m6000001', '10000000-0000-0000-0000-000000000006', 'c6000001', 'Panini', 'Daily selection', 1800, 0),
('m6000002', '10000000-0000-0000-0000-000000000006', 'c6000001', 'Classic Pasta Bolognese', '', 1800, 1),
('m6000003', '10000000-0000-0000-0000-000000000006', 'c6000001', 'Pizza al Padellino', 'Deep dish-style Torinese pizza', 1800, 2),
('m6000004', '10000000-0000-0000-0000-000000000006', 'c6000002', 'Ravioletti Amatriciana', '', 1600, 0),
('m6000005', '10000000-0000-0000-0000-000000000006', 'c6000002', 'Spinach & Mascarpone Cannelloni', '', 1800, 1),
('m6000006', '10000000-0000-0000-0000-000000000006', 'c6000002', '4-Course Tasting Menu', '', 5400, 2),
('m6000007', '10000000-0000-0000-0000-000000000006', 'c6000003', 'Housemade Gelato', 'Seasonal flavor', 1100, 0);

-- ---- ANGELICAS ----
INSERT INTO menu_categories (id, restaurant_id, name, sort_order) VALUES
('c7000001', '10000000-0000-0000-0000-000000000007', 'Small Plates', 0),
('c7000002', '10000000-0000-0000-0000-000000000007', 'Entrees', 1);

INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, sort_order) VALUES
('m7000001', '10000000-0000-0000-0000-000000000007', 'c7000001', 'Corn Tortilla Chips & Salsa', '', 700, 0),
('m7000002', '10000000-0000-0000-0000-000000000007', 'c7000001', 'Elotes', '3 grilled corn', 900, 1),
('m7000003', '10000000-0000-0000-0000-000000000007', 'c7000001', 'Angus Beef Sliders (3)', '', 1400, 2),
('m7000004', '10000000-0000-0000-0000-000000000007', 'c7000001', 'Black Bean Empanadas (3)', '', 1500, 3),
('m7000005', '10000000-0000-0000-0000-000000000007', 'c7000001', 'Tamarindo Chicken Wings', '', 1600, 4),
('m7000006', '10000000-0000-0000-0000-000000000007', 'c7000001', 'Ceviche Peruano', '', 1900, 5),
('m7000007', '10000000-0000-0000-0000-000000000007', 'c7000002', 'Grilled Salmon', '', 3200, 0),
('m7000008', '10000000-0000-0000-0000-000000000007', 'c7000002', 'Bone-In Ribeye (18oz)', '', 4500, 1);

-- ---- BROADWAY MASALA ----
INSERT INTO menu_categories (id, restaurant_id, name, sort_order) VALUES
('c8000001', '10000000-0000-0000-0000-000000000008', 'Appetizers', 0),
('c8000002', '10000000-0000-0000-0000-000000000008', 'Vegetarian Entrees', 1),
('c8000003', '10000000-0000-0000-0000-000000000008', 'Non-Vegetarian Entrees', 2);

INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, sort_order) VALUES
('m8000001', '10000000-0000-0000-0000-000000000008', 'c8000001', 'Spiced Potato & Pea Turnovers', 'Samosas', 1395, 0),
('m8000002', '10000000-0000-0000-0000-000000000008', 'c8000001', 'Lotus Root Patties', '', 1795, 1),
('m8000003', '10000000-0000-0000-0000-000000000008', 'c8000002', 'Lahsooni Saag', 'With rice and naan', 1795, 0),
('m8000004', '10000000-0000-0000-0000-000000000008', 'c8000002', 'Paneer Tawa Masala', 'With rice and naan', 1795, 1),
('m8000005', '10000000-0000-0000-0000-000000000008', 'c8000002', 'Garbanzo Beans Curry', 'With rice and naan', 1795, 2),
('m8000006', '10000000-0000-0000-0000-000000000008', 'c8000003', 'Butter Chicken', 'With rice and naan', 1895, 0),
('m8000007', '10000000-0000-0000-0000-000000000008', 'c8000003', 'Chicken Thighs with Garam Masala', 'With rice and naan', 1895, 1),
('m8000008', '10000000-0000-0000-0000-000000000008', 'c8000003', 'Lamb Roganjosh', 'With rice and naan', 2095, 2);

-- ---- HURRICA ----
INSERT INTO menu_categories (id, restaurant_id, name, sort_order) VALUES
('c9000001', '10000000-0000-0000-0000-000000000009', 'Raw Bar', 0),
('c9000002', '10000000-0000-0000-0000-000000000009', 'Small Plates', 1),
('c9000003', '10000000-0000-0000-0000-000000000009', 'Hearth Entrees', 2);

INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, sort_order) VALUES
('m9000001', '10000000-0000-0000-0000-000000000009', 'c9000001', 'Baked Miyagi Oyster', '', 600, 0),
('m9000002', '10000000-0000-0000-0000-000000000009', 'c9000001', 'Mendocino Uni', '', 1000, 1),
('m9000003', '10000000-0000-0000-0000-000000000009', 'c9000001', 'Live Sea Scallop', '', 1200, 2),
('m9000004', '10000000-0000-0000-0000-000000000009', 'c9000002', 'Warm Milk Bread', '', 800, 0),
('m9000005', '10000000-0000-0000-0000-000000000009', 'c9000002', 'Shellfish Chowder', '', 1600, 1),
('m9000006', '10000000-0000-0000-0000-000000000009', 'c9000002', 'Lobster Ravioli', '', 2100, 2),
('m9000007', '10000000-0000-0000-0000-000000000009', 'c9000003', 'Seared Yellowtail Jack', '', 3900, 0),
('m9000008', '10000000-0000-0000-0000-000000000009', 'c9000003', 'Pan-Roasted Black Cod', '', 4200, 1),
('m9000009', '10000000-0000-0000-0000-000000000009', 'c9000003', 'Slow-Roasted Pork Chop', '', 4500, 2),
('m9000010', '10000000-0000-0000-0000-000000000009', 'c9000003', 'Whole-Roasted Dorade', 'Feeds 2-3', 4800, 3);

-- ---- PAMILYA ----
INSERT INTO menu_categories (id, restaurant_id, name, sort_order) VALUES
('ca000001', '10000000-0000-0000-0000-000000000010', 'Appetizers', 0),
('ca000002', '10000000-0000-0000-0000-000000000010', 'Silog Breakfasts', 1),
('ca000003', '10000000-0000-0000-0000-000000000010', 'Entree Bowls', 2);

INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, sort_order) VALUES
('ma000001', '10000000-0000-0000-0000-000000000010', 'ca000001', 'Steamed Dumplings (4 pcs)', '', 549, 0),
('ma000002', '10000000-0000-0000-0000-000000000010', 'ca000001', 'Pork & Shrimp Lumpia (5 pcs)', '', 719, 1),
('ma000003', '10000000-0000-0000-0000-000000000010', 'ca000002', 'Longanisa Silog', 'With garlic rice, eggs, ensalada, atchara', 1995, 0),
('ma000004', '10000000-0000-0000-0000-000000000010', 'ca000002', 'Pork Tocino Silog', 'With garlic rice, eggs, ensalada, atchara', 1995, 1),
('ma000005', '10000000-0000-0000-0000-000000000010', 'ca000002', 'Fried Milkfish Silog', 'With garlic rice, eggs, ensalada, atchara', 1995, 2),
('ma000006', '10000000-0000-0000-0000-000000000010', 'ca000003', 'Crispy Pork Sisig', 'With rice, salad & pickled veggies', 2089, 0),
('ma000007', '10000000-0000-0000-0000-000000000010', 'ca000003', 'Sinigang Soup Cup', '', 1499, 1);

-- ---- LA FONDA ----
INSERT INTO menu_categories (id, restaurant_id, name, sort_order) VALUES
('cb000001', '10000000-0000-0000-0000-000000000011', 'Appetizers', 0),
('cb000002', '10000000-0000-0000-0000-000000000011', 'Main Dishes', 1),
('cb000003', '10000000-0000-0000-0000-000000000011', 'Tacos', 2);

INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, sort_order) VALUES
('mb000001', '10000000-0000-0000-0000-000000000011', 'cb000001', 'Choriqueso', 'Melted cheese with chorizo', 1300, 0),
('mb000002', '10000000-0000-0000-0000-000000000011', 'cb000001', 'Taquitos de Papa', 'Crispy potato taquitos', 1100, 1),
('mb000003', '10000000-0000-0000-0000-000000000011', 'cb000002', 'Mole Poblano', 'Signature mole with rice, beans, tortillas', 2000, 0),
('mb000004', '10000000-0000-0000-0000-000000000011', 'cb000002', 'Chile Relleno', 'With rice, beans, tortillas', 2000, 1),
('mb000005', '10000000-0000-0000-0000-000000000011', 'cb000002', 'Gorditas', 'With rice, beans, tortillas', 1900, 2),
('mb000006', '10000000-0000-0000-0000-000000000011', 'cb000002', 'Pozole', '', 2200, 3),
('mb000007', '10000000-0000-0000-0000-000000000011', 'cb000003', 'Pork Belly Tacos', '', 1100, 0);

-- ---- PIZZERIA CARDAMOMO ----
INSERT INTO menu_categories (id, restaurant_id, name, sort_order) VALUES
('cc000001', '10000000-0000-0000-0000-000000000012', 'Antipasti', 0),
('cc000002', '10000000-0000-0000-0000-000000000012', 'Pizzas', 1),
('cc000003', '10000000-0000-0000-0000-000000000012', 'Pasta', 2),
('cc000004', '10000000-0000-0000-0000-000000000012', 'Desserts', 3);

INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, sort_order) VALUES
('mc000001', '10000000-0000-0000-0000-000000000012', 'cc000001', 'Marinated Taggiasca Olives', '', 1300, 0),
('mc000002', '10000000-0000-0000-0000-000000000012', 'cc000001', 'Arancini Cacio e Pepe', '', 1400, 1),
('mc000003', '10000000-0000-0000-0000-000000000012', 'cc000001', 'Meatballs', '', 1500, 2),
('mc000004', '10000000-0000-0000-0000-000000000012', 'cc000002', 'Margherita', 'Sourdough crust', 2300, 0),
('mc000005', '10000000-0000-0000-0000-000000000012', 'cc000002', 'Salsiccia', '', 2800, 1),
('mc000006', '10000000-0000-0000-0000-000000000012', 'cc000002', 'Bronte (Pistachio)', '', 2800, 2),
('mc000007', '10000000-0000-0000-0000-000000000012', 'cc000002', 'Spicy Pepperoni with Honey', '', 2800, 3),
('mc000008', '10000000-0000-0000-0000-000000000012', 'cc000002', 'Carbonara', '', 2900, 4),
('mc000009', '10000000-0000-0000-0000-000000000012', 'cc000003', 'Tagliatelle Bolognese', '', 2700, 0),
('mc000010', '10000000-0000-0000-0000-000000000012', 'cc000004', 'Tiramisu Classic', '', 1200, 0);

-- ---- MISTRAL ----
INSERT INTO menu_categories (id, restaurant_id, name, sort_order) VALUES
('cd000001', '10000000-0000-0000-0000-000000000013', 'Starters', 0),
('cd000002', '10000000-0000-0000-0000-000000000013', 'Entrees', 1);

INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, sort_order) VALUES
('md000001', '10000000-0000-0000-0000-000000000013', 'cd000001', 'Oak Fire Baked Focaccia', '', 500, 0),
('md000002', '10000000-0000-0000-0000-000000000013', 'cd000001', 'Mediterranean Mezze Sampler', '', 1500, 1),
('md000003', '10000000-0000-0000-0000-000000000013', 'cd000001', 'Calamari with Rock Shrimp & Zucchini', '', 1500, 2),
('md000004', '10000000-0000-0000-0000-000000000013', 'cd000001', 'Crispy Fritto Misto', '', 1700, 3),
('md000005', '10000000-0000-0000-0000-000000000013', 'cd000002', 'Pappardelle Pasta', '', 3000, 0),
('md000006', '10000000-0000-0000-0000-000000000013', 'cd000002', 'Citrus Risotto', '', 3900, 1);

-- ---- BAO ----
INSERT INTO menu_categories (id, restaurant_id, name, sort_order) VALUES
('ce000001', '10000000-0000-0000-0000-000000000014', 'Dim Sum & Dumplings', 0),
('ce000002', '10000000-0000-0000-0000-000000000014', 'Entrees', 1);

INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, sort_order) VALUES
('me000001', '10000000-0000-0000-0000-000000000014', 'ce000001', 'Shanghai Xiao Long Bao (6)', '', 1250, 0),
('me000002', '10000000-0000-0000-0000-000000000014', 'ce000001', 'Steamed Pork & Shrimp Shumai (4)', '', 1050, 1),
('me000003', '10000000-0000-0000-0000-000000000014', 'ce000001', 'Steamed BBQ Pork Bao (3)', '', 950, 2),
('me000004', '10000000-0000-0000-0000-000000000014', 'ce000001', 'Pan-Fried Chicken Pot Sticker (5)', '', 1050, 3),
('me000005', '10000000-0000-0000-0000-000000000014', 'ce000001', 'Spicy Wonton (6)', '', 1100, 4),
('me000006', '10000000-0000-0000-0000-000000000014', 'ce000001', 'Steamed Sticky Rice in Lotus Leaves', '', 700, 5),
('me000007', '10000000-0000-0000-0000-000000000014', 'ce000002', 'Honey Walnut Prawn', '', 2600, 0),
('me000008', '10000000-0000-0000-0000-000000000014', 'ce000002', 'Shanghai Chicken Fried Noodle', '', 2200, 1);

-- ---- LIMON ----
INSERT INTO menu_categories (id, restaurant_id, name, sort_order) VALUES
('cf000001', '10000000-0000-0000-0000-000000000015', 'Ceviches', 0),
('cf000002', '10000000-0000-0000-0000-000000000015', 'Piqueos', 1),
('cf000003', '10000000-0000-0000-0000-000000000015', 'Clasicos', 2);

INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, sort_order) VALUES
('mf000001', '10000000-0000-0000-0000-000000000015', 'cf000001', 'Mixto Clasico', 'With choclo, cancha & sweet potato', 2530, 0),
('mf000002', '10000000-0000-0000-0000-000000000015', 'cf000001', 'Pescado Clasico', 'With choclo, cancha & sweet potato', 2100, 1),
('mf000003', '10000000-0000-0000-0000-000000000015', 'cf000002', 'Beef Empanada', '', 1400, 0),
('mf000004', '10000000-0000-0000-0000-000000000015', 'cf000002', 'Chicken Empanadas', '', 1540, 1),
('mf000005', '10000000-0000-0000-0000-000000000015', 'cf000002', 'Truffle Mac & Cheese', '', 1430, 2),
('mf000006', '10000000-0000-0000-0000-000000000015', 'cf000003', 'Saltado de Pollo', '', 2600, 0),
('mf000007', '10000000-0000-0000-0000-000000000015', 'cf000003', 'Lomo Saltado', '', 3400, 1),
('mf000008', '10000000-0000-0000-0000-000000000015', 'cf000003', 'Platano Frito', 'Fried plantains', 1100, 2);

-- ============================================================
-- TEST CUSTOMER
-- ============================================================
INSERT INTO customers (id, phone, full_name, email, is_guest) VALUES
('20000000-0000-0000-0000-000000000001', '(650) 555-0100', 'Test Customer', 'test@rwcdelivers.com', false);

INSERT INTO addresses (id, customer_id, street, city, zip, lat, lng, label, is_within_zone) VALUES
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '400 Broadway', 'Redwood City', '94063', 37.4855, -122.2282, 'Home', true);
