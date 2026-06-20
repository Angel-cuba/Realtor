-- Realtor — 30 sample listings across 8 cities for QA / pre-launch demos.
--
-- Idempotent: properties and listings use deterministic UUIDs and
-- ON CONFLICT DO NOTHING so re-running this file is safe. Re-run after
-- the base seed (`npm run db:seed`) so the agents (00...0201..0203) exist.
--
-- Cities covered (every one returns >=1 result in /comprar and/or /rentar):
--   Miami        — Brickell, Coconut Grove, Wynwood
--   Mexico City  — Polanco, Roma Norte, Condesa
--   Madrid       — Salamanca, Malasana, Chamberi
--   Buenos Aires — Palermo, Recoleta
--   Bogota       — Chapinero, Usaquen
--   Medellin     — El Poblado, Laureles
--   Barcelona    — Eixample, Gracia
--   San Juan     — Condado, Old San Juan

-- ============================================================
-- 1. Properties (30)
-- ============================================================
INSERT INTO public.properties (id, property_type, address_line_1, city, neighborhood, region, country, beds, baths, area_sqft, lot_sqft) VALUES
  -- Miami (5)
  ('00000000-0000-4000-8000-000000000701', 'apartment', '900 Brickell Ave', 'Miami', 'Brickell', 'FL', 'US', 2, 2, 1320, NULL),
  ('00000000-0000-4000-8000-000000000702', 'penthouse', '1200 Biscayne Blvd', 'Miami', 'Wynwood', 'FL', 'US', 4, 4, 3180, NULL),
  ('00000000-0000-4000-8000-000000000703', 'apartment', '450 Brickell Key Dr', 'Miami', 'Brickell', 'FL', 'US', 1, 1, 860, NULL),
  ('00000000-0000-4000-8000-000000000704', 'villa', '3500 Main Hwy', 'Miami', 'Coconut Grove', 'FL', 'US', 5, 5, 4720, 11200),
  ('00000000-0000-4000-8000-000000000705', 'townhouse', '2200 NW 2nd Ave', 'Miami', 'Wynwood', 'FL', 'US', 3, 3, 1980, 2400),
  -- Mexico City (5)
  ('00000000-0000-4000-8000-000000000706', 'apartment', 'Av Presidente Masaryk 200', 'Ciudad de Mexico', 'Polanco', 'CDMX', 'MX', 3, 3, 2150, NULL),
  ('00000000-0000-4000-8000-000000000707', 'apartment', 'Calle Orizaba 80', 'Ciudad de Mexico', 'Roma Norte', 'CDMX', 'MX', 2, 2, 1180, NULL),
  ('00000000-0000-4000-8000-000000000708', 'penthouse', 'Av Tamaulipas 90', 'Ciudad de Mexico', 'Condesa', 'CDMX', 'MX', 3, 3, 2400, NULL),
  ('00000000-0000-4000-8000-000000000709', 'apartment', 'Calle Amsterdam 150', 'Ciudad de Mexico', 'Condesa', 'CDMX', 'MX', 1, 1, 720, NULL),
  ('00000000-0000-4000-8000-000000000710', 'house', 'Calle Sierra Madre 45', 'Ciudad de Mexico', 'Polanco', 'CDMX', 'MX', 4, 4, 3650, 4800),
  -- Madrid (5)
  ('00000000-0000-4000-8000-000000000711', 'apartment', 'Calle Serrano 110', 'Madrid', 'Salamanca', 'Madrid', 'ES', 3, 2, 1610, NULL),
  ('00000000-0000-4000-8000-000000000712', 'apartment', 'Calle del Pez 18', 'Madrid', 'Malasana', 'Madrid', 'ES', 2, 1, 970, NULL),
  ('00000000-0000-4000-8000-000000000713', 'penthouse', 'Calle Almagro 22', 'Madrid', 'Chamberi', 'Madrid', 'ES', 3, 3, 2050, NULL),
  ('00000000-0000-4000-8000-000000000714', 'apartment', 'Calle Velazquez 90', 'Madrid', 'Salamanca', 'Madrid', 'ES', 4, 3, 2380, NULL),
  ('00000000-0000-4000-8000-000000000715', 'apartment', 'Calle Fuencarral 70', 'Madrid', 'Malasana', 'Madrid', 'ES', 1, 1, 640, NULL),
  -- Buenos Aires (4)
  ('00000000-0000-4000-8000-000000000716', 'apartment', 'Av Santa Fe 3200', 'Buenos Aires', 'Palermo', 'CABA', 'AR', 2, 2, 1180, NULL),
  ('00000000-0000-4000-8000-000000000717', 'apartment', 'Av Alvear 1500', 'Buenos Aires', 'Recoleta', 'CABA', 'AR', 3, 3, 1950, NULL),
  ('00000000-0000-4000-8000-000000000718', 'penthouse', 'Av Libertador 4400', 'Buenos Aires', 'Palermo', 'CABA', 'AR', 4, 3, 2680, NULL),
  ('00000000-0000-4000-8000-000000000719', 'apartment', 'Calle Arenales 1800', 'Buenos Aires', 'Recoleta', 'CABA', 'AR', 1, 1, 720, NULL),
  -- Bogota (3)
  ('00000000-0000-4000-8000-000000000720', 'apartment', 'Carrera 11 #93', 'Bogota', 'Chapinero', 'Cundinamarca', 'CO', 2, 2, 1240, NULL),
  ('00000000-0000-4000-8000-000000000721', 'house', 'Calle 119 #6', 'Bogota', 'Usaquen', 'Cundinamarca', 'CO', 4, 4, 3120, 4400),
  ('00000000-0000-4000-8000-000000000722', 'apartment', 'Carrera 7 #70', 'Bogota', 'Chapinero', 'Cundinamarca', 'CO', 1, 1, 680, NULL),
  -- Medellin (3)
  ('00000000-0000-4000-8000-000000000723', 'apartment', 'Carrera 35 #8A', 'Medellin', 'El Poblado', 'Antioquia', 'CO', 3, 2, 1480, NULL),
  ('00000000-0000-4000-8000-000000000724', 'house', 'Calle 35 #65', 'Medellin', 'Laureles', 'Antioquia', 'CO', 4, 3, 2780, 3800),
  ('00000000-0000-4000-8000-000000000725', 'apartment', 'Carrera 43F #11', 'Medellin', 'El Poblado', 'Antioquia', 'CO', 2, 2, 1090, NULL),
  -- Barcelona (3)
  ('00000000-0000-4000-8000-000000000726', 'apartment', 'Passeig de Gracia 80', 'Barcelona', 'Eixample', 'Catalonia', 'ES', 3, 2, 1690, NULL),
  ('00000000-0000-4000-8000-000000000727', 'apartment', 'Carrer de Verdi 60', 'Barcelona', 'Gracia', 'Catalonia', 'ES', 2, 1, 920, NULL),
  ('00000000-0000-4000-8000-000000000728', 'penthouse', 'Avinguda Diagonal 410', 'Barcelona', 'Eixample', 'Catalonia', 'ES', 4, 3, 2310, NULL),
  -- San Juan (2)
  ('00000000-0000-4000-8000-000000000729', 'apartment', '1130 Ashford Ave', 'San Juan', 'Condado', 'PR', 'PR', 2, 2, 1320, NULL),
  ('00000000-0000-4000-8000-000000000730', 'townhouse', '256 Calle del Cristo', 'San Juan', 'Old San Juan', 'PR', 'PR', 3, 3, 1880, 2100)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. Listings (30) — status='published' so they appear in /comprar and /rentar
-- ============================================================
INSERT INTO public.listings (id, property_id, agent_id, slug, title, listing_type, status, price, currency, summary, tags, highlights, published_at) VALUES
  -- Miami (5)
  ('00000000-0000-4000-8000-000000000801', '00000000-0000-4000-8000-000000000701', '00000000-0000-4000-8000-000000000202', 'brickell-skyline-condo', 'Brickell skyline condo with bay views', 'sale', 'published', 685000, 'USD', 'High-floor condo on Brickell Avenue with full bay-and-skyline exposure, modern finishes, and concierge building amenities.', '["Bay view","Pool","Doorman"]'::json, '["Floor-to-ceiling windows","Italian kitchen","Walk to restaurants"]'::json, now() - interval '12 days'),
  ('00000000-0000-4000-8000-000000000802', '00000000-0000-4000-8000-000000000702', '00000000-0000-4000-8000-000000000202', 'wynwood-arts-penthouse', 'Downtown skyline penthouse near the arts district', 'sale', 'published', 2140000, 'USD', 'A high-floor residence with wide skyline views, gallery walls, generous entertaining space, and private elevator access.', '["Penthouse","Skyline view","Private elevator"]'::json, '["Wraparound terrace","Chef kitchen","Two-car garage"]'::json, now() - interval '5 days'),
  ('00000000-0000-4000-8000-000000000803', '00000000-0000-4000-8000-000000000703', '00000000-0000-4000-8000-000000000202', 'brickell-key-rental-studio', 'Brickell Key one-bedroom with marina views', 'rent', 'published', 3200, 'USD', 'Compact and bright one-bedroom on Brickell Key, walking distance to downtown, with marina sunsets every evening.', '["Marina","Furnished","Available now"]'::json, '["Hardwood floors","In-unit laundry","Walkable"]'::json, now() - interval '2 days'),
  ('00000000-0000-4000-8000-000000000804', '00000000-0000-4000-8000-000000000704', '00000000-0000-4000-8000-000000000201', 'coconut-grove-villa', 'Coconut Grove villa with tropical courtyard', 'sale', 'published', 3950000, 'USD', 'Architectural villa tucked into mature trees with a private courtyard, pool, guest suite, and chef-grade kitchen.', '["Villa","Pool","Lush gardens"]'::json, '["Guest suite","Outdoor kitchen","Private gate"]'::json, now() - interval '18 days'),
  ('00000000-0000-4000-8000-000000000805', '00000000-0000-4000-8000-000000000705', '00000000-0000-4000-8000-000000000201', 'wynwood-townhouse-rental', 'Wynwood townhouse minutes from the murals', 'rent', 'published', 5800, 'USD', 'Three-level townhouse in the heart of Wynwood with rooftop terrace and dedicated office space.', '["Rooftop","Office","Walkable"]'::json, '["Two-car garage","Rooftop deck","Walk to galleries"]'::json, now() - interval '7 days'),
  -- Mexico City (5)
  ('00000000-0000-4000-8000-000000000806', '00000000-0000-4000-8000-000000000706', '00000000-0000-4000-8000-000000000203', 'polanco-masaryk-condo', 'Polanco apartment steps from Masaryk', 'sale', 'published', 14500000, 'USD', 'Refined three-bedroom on Avenida Masaryk with high-end finishes, private parking, and 24/7 concierge.', '["Concierge","Parking","Boutique building"]'::json, '["Marble kitchen","Master suite","Boutique gym"]'::json, now() - interval '20 days'),
  ('00000000-0000-4000-8000-000000000807', '00000000-0000-4000-8000-000000000707', '00000000-0000-4000-8000-000000000203', 'roma-norte-design-loft', 'Roma Norte design loft with terrace', 'sale', 'published', 7200000, 'USD', 'Open-plan loft in a remodeled building on Orizaba with a private terrace and rooftop garden access.', '["Loft","Terrace","Rooftop garden"]'::json, '["Concrete floors","Private terrace","Walk to cafes"]'::json, now() - interval '11 days'),
  ('00000000-0000-4000-8000-000000000808', '00000000-0000-4000-8000-000000000708', '00000000-0000-4000-8000-000000000203', 'condesa-tamaulipas-penthouse', 'Condesa penthouse over Parque Mexico', 'sale', 'published', 11200000, 'USD', 'Penthouse with double-height living, panoramic park views, and a wraparound terrace ideal for entertaining.', '["Penthouse","Park view","Double height"]'::json, '["Wraparound terrace","Park views","Private elevator"]'::json, now() - interval '6 days'),
  ('00000000-0000-4000-8000-000000000809', '00000000-0000-4000-8000-000000000709', '00000000-0000-4000-8000-000000000203', 'condesa-amsterdam-rental', 'Condesa Amsterdam one-bedroom', 'rent', 'published', 28000, 'USD', 'Bright one-bedroom on the iconic Calle Amsterdam loop, blocks from Parque Mexico and Avenida Tamaulipas.', '["Furnished","Walkable","Available now"]'::json, '["Wood floors","Quiet building","Open kitchen"]'::json, now() - interval '3 days'),
  ('00000000-0000-4000-8000-000000000810', '00000000-0000-4000-8000-000000000710', '00000000-0000-4000-8000-000000000203', 'polanco-family-house-rental', 'Polanco family house with garden', 'rent', 'published', 95000, 'USD', 'Spacious family home in residential Polanco with a private garden, four bedrooms, and a service area.', '["Garden","Family","Private parking"]'::json, '["Private garden","Two-car garage","Service quarters"]'::json, now() - interval '14 days'),
  -- Madrid (5)
  ('00000000-0000-4000-8000-000000000811', '00000000-0000-4000-8000-000000000711', '00000000-0000-4000-8000-000000000201', 'salamanca-serrano-apartment', 'Salamanca apartment on Calle Serrano', 'sale', 'published', 1290000, 'EUR', 'Classic Salamanca apartment with original mouldings, restored hardwood floors, and a south-facing balcony.', '["Classic","Balcony","Restored"]'::json, '["Original mouldings","Hardwood floors","South-facing balcony"]'::json, now() - interval '22 days'),
  ('00000000-0000-4000-8000-000000000812', '00000000-0000-4000-8000-000000000712', '00000000-0000-4000-8000-000000000201', 'malasana-loft-rental', 'Malasana loft minutes from Plaza del Dos de Mayo', 'rent', 'published', 1850, 'EUR', 'Renovated loft in the heart of Malasana, walking distance to bars, restaurants, and Gran Via.', '["Renovated","Walkable","Furnished"]'::json, '["Exposed brick","Open kitchen","Quiet building"]'::json, now() - interval '4 days'),
  ('00000000-0000-4000-8000-000000000813', '00000000-0000-4000-8000-000000000713', '00000000-0000-4000-8000-000000000201', 'chamberi-almagro-penthouse', 'Chamberi penthouse with private terrace', 'sale', 'published', 1780000, 'EUR', 'Penthouse with private terrace overlooking Chamberi rooftops, fully renovated with high ceilings.', '["Penthouse","Terrace","Renovated"]'::json, '["Private terrace","High ceilings","South orientation"]'::json, now() - interval '9 days'),
  ('00000000-0000-4000-8000-000000000814', '00000000-0000-4000-8000-000000000714', '00000000-0000-4000-8000-000000000201', 'salamanca-velazquez-family', 'Salamanca family apartment on Velazquez', 'sale', 'published', 2450000, 'EUR', 'Large four-bedroom apartment in the heart of the Golden Mile, ideal for families seeking space and location.', '["Family","Doorman","Golden Mile"]'::json, '["Four bedrooms","Service entrance","Doorman"]'::json, now() - interval '15 days'),
  ('00000000-0000-4000-8000-000000000815', '00000000-0000-4000-8000-000000000715', '00000000-0000-4000-8000-000000000201', 'malasana-fuencarral-studio', 'Malasana studio on Calle Fuencarral', 'rent', 'published', 1200, 'EUR', 'Compact furnished studio on Fuencarral, perfect for digital nomads who want to live in the city center.', '["Studio","Furnished","City center"]'::json, '["Furnished","High floor","Walk everywhere"]'::json, now() - interval '1 day'),
  -- Buenos Aires (4)
  ('00000000-0000-4000-8000-000000000816', '00000000-0000-4000-8000-000000000716', '00000000-0000-4000-8000-000000000202', 'palermo-santa-fe-apartment', 'Palermo apartment on Avenida Santa Fe', 'sale', 'published', 285000, 'USD', 'Renovated two-bedroom on Avenida Santa Fe with a wide balcony and natural light all day.', '["Renovated","Balcony","Natural light"]'::json, '["Wide balcony","Open kitchen","Bright"]'::json, now() - interval '13 days'),
  ('00000000-0000-4000-8000-000000000817', '00000000-0000-4000-8000-000000000717', '00000000-0000-4000-8000-000000000202', 'recoleta-alvear-classic', 'Recoleta classic on Avenida Alvear', 'sale', 'published', 690000, 'USD', 'Pre-war classic apartment with high ceilings and parquet floors, steps from Plaza Francia.', '["Classic","Pre-war","Parquet"]'::json, '["High ceilings","Parquet floors","Service quarters"]'::json, now() - interval '17 days'),
  ('00000000-0000-4000-8000-000000000818', '00000000-0000-4000-8000-000000000718', '00000000-0000-4000-8000-000000000202', 'palermo-libertador-penthouse', 'Palermo penthouse on Avenida Libertador', 'rent', 'published', 2400, 'USD', 'Penthouse with terrace and grill, river views, and access to a building pool and gym.', '["Penthouse","Pool","River view"]'::json, '["Terrace and grill","Building pool","Building gym"]'::json, now() - interval '8 days'),
  ('00000000-0000-4000-8000-000000000819', '00000000-0000-4000-8000-000000000719', '00000000-0000-4000-8000-000000000202', 'recoleta-arenales-studio', 'Recoleta studio on Calle Arenales', 'rent', 'published', 780, 'USD', 'Furnished studio steps from Recoleta cemetery and the cafes of Plaza Francia.', '["Studio","Furnished","Walkable"]'::json, '["Furnished","Quiet street","Walk to cafes"]'::json, now() - interval '2 days'),
  -- Bogota (3)
  ('00000000-0000-4000-8000-000000000820', '00000000-0000-4000-8000-000000000720', '00000000-0000-4000-8000-000000000203', 'chapinero-93-condo', 'Chapinero condo near Parque 93', 'sale', 'published', 320000, 'USD', 'Two-bedroom condo on Carrera 11 with park views and restaurants at the doorstep.', '["Park view","Walkable","Restaurants"]'::json, '["Park view","Walk to restaurants","Bright"]'::json, now() - interval '10 days'),
  ('00000000-0000-4000-8000-000000000821', '00000000-0000-4000-8000-000000000721', '00000000-0000-4000-8000-000000000203', 'usaquen-family-house', 'Usaquen family house with garden', 'sale', 'published', 720000, 'USD', 'Four-bedroom family house in residential Usaquen with garden and weekend market across the street.', '["Family","Garden","Market"]'::json, '["Private garden","Family room","Weekend market"]'::json, now() - interval '16 days'),
  ('00000000-0000-4000-8000-000000000822', '00000000-0000-4000-8000-000000000722', '00000000-0000-4000-8000-000000000203', 'chapinero-zona-g-rental', 'Chapinero studio in Zona G', 'rent', 'published', 950, 'USD', 'Furnished studio in Zona G, surrounded by cafes and restaurants, ideal for short stays.', '["Studio","Furnished","Cafes"]'::json, '["Furnished","Wifi included","Walk to cafes"]'::json, now() - interval '5 days'),
  -- Medellin (3)
  ('00000000-0000-4000-8000-000000000823', '00000000-0000-4000-8000-000000000723', '00000000-0000-4000-8000-000000000203', 'poblado-condo-mountain-view', 'El Poblado condo with mountain views', 'sale', 'published', 245000, 'USD', 'Three-bedroom condo in El Poblado with terrace and mountain views, walking distance to Lleras.', '["Mountain view","Terrace","Walkable"]'::json, '["Private terrace","Mountain view","Concierge"]'::json, now() - interval '7 days'),
  ('00000000-0000-4000-8000-000000000824', '00000000-0000-4000-8000-000000000724', '00000000-0000-4000-8000-000000000203', 'laureles-family-home', 'Laureles family home on Estadio', 'sale', 'published', 410000, 'USD', 'Four-bedroom family home in Laureles with patio, service quarters, and quiet residential street.', '["Family","Patio","Quiet street"]'::json, '["Patio","Service quarters","Two-car garage"]'::json, now() - interval '12 days'),
  ('00000000-0000-4000-8000-000000000825', '00000000-0000-4000-8000-000000000725', '00000000-0000-4000-8000-000000000203', 'poblado-rental-furnished', 'El Poblado furnished apartment for rent', 'rent', 'published', 1450, 'USD', 'Furnished two-bedroom apartment in El Poblado, walking distance to Provenza and restaurants.', '["Furnished","Walkable","Pool"]'::json, '["Furnished","Building pool","Walk to Provenza"]'::json, now() - interval '3 days'),
  -- Barcelona (3)
  ('00000000-0000-4000-8000-000000000826', '00000000-0000-4000-8000-000000000726', '00000000-0000-4000-8000-000000000201', 'eixample-gracia-classic', 'Eixample apartment on Passeig de Gracia', 'sale', 'published', 1450000, 'EUR', 'Classic Eixample apartment with high ceilings, restored mosaic tiles, and a sunny gallery.', '["Modernista","Restored","Gallery"]'::json, '["High ceilings","Mosaic tiles","Sunny gallery"]'::json, now() - interval '19 days'),
  ('00000000-0000-4000-8000-000000000827', '00000000-0000-4000-8000-000000000727', '00000000-0000-4000-8000-000000000201', 'gracia-verdi-rental', 'Gracia apartment on Carrer de Verdi', 'rent', 'published', 1750, 'EUR', 'Two-bedroom on Verdi in the village vibe of Gracia, steps from squares and indie cafes.', '["Village","Walkable","Cafes"]'::json, '["Village vibe","Walk to squares","Bright"]'::json, now() - interval '4 days'),
  ('00000000-0000-4000-8000-000000000828', '00000000-0000-4000-8000-000000000728', '00000000-0000-4000-8000-000000000201', 'eixample-diagonal-penthouse', 'Eixample penthouse on Avinguda Diagonal', 'sale', 'published', 2350000, 'EUR', 'Penthouse on Diagonal with private terrace and city views, fully renovated with smart-home wiring.', '["Penthouse","Smart home","Terrace"]'::json, '["Private terrace","Smart home","Renovated"]'::json, now() - interval '21 days'),
  -- San Juan (2)
  ('00000000-0000-4000-8000-000000000829', '00000000-0000-4000-8000-000000000729', '00000000-0000-4000-8000-000000000202', 'condado-ashford-apartment', 'Condado apartment on Ashford Avenue', 'sale', 'published', 580000, 'USD', 'Two-bedroom condo across from the beach with ocean breeze, building pool, and concierge.', '["Beach","Pool","Concierge"]'::json, '["Ocean view","Building pool","Concierge"]'::json, now() - interval '9 days'),
  ('00000000-0000-4000-8000-000000000830', '00000000-0000-4000-8000-000000000730', '00000000-0000-4000-8000-000000000202', 'old-san-juan-townhouse', 'Old San Juan townhouse in the historic core', 'rent', 'published', 2900, 'USD', 'Restored townhouse on Calle del Cristo with patio, rooftop, and views over the old city.', '["Historic","Rooftop","Patio"]'::json, '["Historic facade","Rooftop","Restored interiors"]'::json, now() - interval '6 days')
ON CONFLICT (slug) DO NOTHING;
