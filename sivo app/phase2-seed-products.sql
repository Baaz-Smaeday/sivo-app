-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- SIVO Phase 2 — Product Seed Data
-- Paste into Supabase SQL Editor and Run
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Add missing categories
INSERT INTO public.categories (name, slug, sort_order) VALUES
  ('Side & Accent Tables', 'side-accent-tables', 13),
  ('Bar Collections', 'bar-collections', 14),
  ('Writing Desks', 'writing-desks', 15),
  ('Contract Furniture', 'contract-furniture', 16),
  ('Dining Sets', 'dining-sets', 17),
  ('Bedroom Furniture', 'bedroom-furniture', 18),
  ('Bathroom Furniture', 'bathroom-furniture', 19),
  ('Storage & Shelving', 'storage-shelving', 20)
ON CONFLICT (slug) DO NOTHING;

-- Insert all 30 products

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFDTACAN1145',
  'Arced Acacia Dining Table',
  'arced-acacia-dining-table',
  (SELECT id FROM public.categories WHERE slug = 'dining-tables'),
  'Live edge acacia top with arced metal legs',
  'Acacia Wood / Metal',
  '200×100×76 cm',
  285,
  684,
  10,
  56,
  true,
  false,
  1
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFDTACAN1150',
  'Spider Leg Dining Table',
  'spider-leg-dining-table',
  (SELECT id FROM public.categories WHERE slug = 'dining-tables'),
  'Spider leg base with natural edge acacia top',
  'Acacia Wood / Metal',
  '220×100×76 cm',
  310,
  744,
  8,
  14,
  true,
  false,
  2
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFDTSDAN1155',
  'Sheet Leg Dining Table',
  'sheet-leg-dining-table',
  (SELECT id FROM public.categories WHERE slug = 'dining-tables'),
  'Curved sheet metal base, premium acacia top',
  'Acacia Wood / Metal',
  '260×100×76 cm',
  340,
  816,
  8,
  56,
  true,
  false,
  3
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFDTRDAN1170',
  'Round Acacia Dining Table',
  'round-acacia-dining-table',
  (SELECT id FROM public.categories WHERE slug = 'dining-tables'),
  'Round dining table with hairpin legs',
  'Acacia Wood / Metal',
  '130×130×76 cm',
  265,
  636,
  10,
  14,
  true,
  false,
  4
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFDTEDMN1185',
  'Butterfly Extension Table',
  'butterfly-extension-table',
  (SELECT id FROM public.categories WHERE slug = 'dining-tables'),
  'Extension mechanism, expands from 160 to 200cm',
  'Mango Wood / Metal',
  '160-200×90×76 cm',
  395,
  948,
  6,
  56,
  true,
  false,
  5
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFDTPTMN1648',
  'Parquetry Top Dining Table',
  'parquetry-top-dining-table',
  (SELECT id FROM public.categories WHERE slug = 'dining-tables'),
  'Handcrafted parquetry top with X-leg base',
  'Mango Wood / Metal',
  '160×80×76 cm',
  320,
  768,
  8,
  56,
  true,
  false,
  6
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFDTMDMB1702',
  'Black Marble X-Leg Table',
  'black-marble-x-leg-table',
  (SELECT id FROM public.categories WHERE slug = 'dining-tables'),
  'Black marble top, mango wood X-leg base',
  'Marble / Mango Wood',
  '180×90×77 cm',
  520,
  1248,
  4,
  56,
  true,
  false,
  7
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFDTMDMW1207',
  'White Marble Round Table',
  'white-marble-round-table',
  (SELECT id FROM public.categories WHERE slug = 'dining-tables'),
  'White marble top, cone wood base',
  'Marble / Mango Wood',
  '130×130×77 cm',
  480,
  1152,
  4,
  56,
  true,
  false,
  8
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFCTRAMN1310',
  'Ball Foot Round Coffee Table',
  'ball-foot-round-coffee-table',
  (SELECT id FROM public.categories WHERE slug = 'coffee-tables'),
  'Round coffee table with distinctive ball feet',
  'Mango Wood',
  '80×80×30 cm',
  95,
  228,
  20,
  14,
  true,
  false,
  9
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFCTRAAS1311',
  'Woven Base Coffee Table',
  'woven-base-coffee-table',
  (SELECT id FROM public.categories WHERE slug = 'coffee-tables'),
  'Woven wood base detail, round acacia top',
  'Acacia Wood',
  '80×80×45 cm',
  110,
  264,
  15,
  14,
  true,
  false,
  10
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFCTRAAN1314',
  'Drum Coffee Table',
  'drum-coffee-table',
  (SELECT id FROM public.categories WHERE slug = 'coffee-tables'),
  'Solid drum shape from acacia wood',
  'Acacia Wood',
  '80×80×45 cm',
  120,
  288,
  15,
  56,
  true,
  false,
  11
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFCTNCAB1519',
  'Black Nesting Coffee Table Set',
  'black-nesting-coffee-table-set',
  (SELECT id FROM public.categories WHERE slug = 'coffee-tables'),
  'Set of 2 nesting tables, black metal frame',
  'Acacia Wood / Metal',
  '75×75×48 cm',
  145,
  348,
  15,
  14,
  true,
  false,
  12
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFCTNCMS1522',
  'Slatted Drum Nesting Tables',
  'slatted-drum-nesting-tables',
  (SELECT id FROM public.categories WHERE slug = 'coffee-tables'),
  'Set of 2 nesting tables with slatted design',
  'Mango Wood',
  '65×65×40 cm',
  130,
  312,
  15,
  56,
  true,
  false,
  13
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFCTNCMN1545',
  'Hexagonal Nesting Set',
  'hexagonal-nesting-set',
  (SELECT id FROM public.categories WHERE slug = 'coffee-tables'),
  'Hexagonal shape, set of 3',
  'Mango Wood / Metal',
  '60×60×45 cm',
  125,
  300,
  15,
  56,
  true,
  false,
  14
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFCTTCTN1380',
  'Coffee Table Set of 3',
  'coffee-table-set-of-3',
  (SELECT id FROM public.categories WHERE slug = 'coffee-tables'),
  'Organic shape nesting set, hairpin legs',
  'Acacia Wood / Metal',
  '59×48×43 cm',
  155,
  372,
  12,
  14,
  true,
  false,
  15
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFSTACMS2377',
  'Amravati Side Table',
  'amravati-side-table',
  (SELECT id FROM public.categories WHERE slug = 'side-accent-tables'),
  'From the Amravati collection — fluted design',
  'Mango Wood',
  '40×34×55 cm',
  65,
  156,
  25,
  14,
  true,
  false,
  16
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFSTUCMW0229',
  'Udaipur Ribbed Side Table',
  'udaipur-ribbed-side-table',
  (SELECT id FROM public.categories WHERE slug = 'side-accent-tables'),
  'White finish, ribbed detailing, gold legs',
  'Mango Wood',
  '40×40×50 cm',
  75,
  180,
  20,
  14,
  true,
  false,
  17
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFCTRCMB0250',
  'Rohtak Coffee Table',
  'rohtak-coffee-table',
  (SELECT id FROM public.categories WHERE slug = 'coffee-tables'),
  'Slatted mango wood top, metal legs',
  'Mango Wood / Metal',
  '120×60×45 cm',
  140,
  336,
  12,
  56,
  true,
  false,
  18
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFWCBCMN1458',
  'Wine Rack Cabinet',
  'wine-rack-cabinet',
  (SELECT id FROM public.categories WHERE slug = 'bar-collections'),
  '12-bottle wine rack with shelf storage',
  'Mango Wood / Metal',
  '80×80×103 cm',
  175,
  420,
  10,
  14,
  true,
  false,
  19
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFBTBCMR1466',
  'Rustic Bar Trolley',
  'rustic-bar-trolley',
  (SELECT id FROM public.categories WHERE slug = 'bar-collections'),
  'Vintage-style bar trolley on wheels',
  'Recycled Wood / Metal',
  '86×46×92 cm',
  165,
  396,
  10,
  14,
  true,
  false,
  20
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFWRBCMR1470',
  'Barrel Wine Rack',
  'barrel-wine-rack',
  (SELECT id FROM public.categories WHERE slug = 'bar-collections'),
  'Barrel-shaped wine storage, 20 bottles',
  'Mango Wood',
  '91×91×106 cm',
  195,
  468,
  6,
  56,
  true,
  false,
  21
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFHBPCMN1420',
  'Parquetry Highboard',
  'parquetry-highboard',
  (SELECT id FROM public.categories WHERE slug = 'storage-shelving'),
  'Sliding barn doors with parquetry panels',
  'Mango Wood / Metal',
  '100×45×160 cm',
  290,
  696,
  6,
  56,
  true,
  false,
  22
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFBSACMS2369',
  'Ajmer Bookshelf',
  'ajmer-bookshelf',
  (SELECT id FROM public.categories WHERE slug = 'storage-shelving'),
  '5-tier open bookshelf, organic shape',
  'Acacia Wood',
  '120×35×155 cm',
  245,
  588,
  8,
  56,
  true,
  false,
  23
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFCALCAA1421',
  'Luni Cabinet',
  'luni-cabinet',
  (SELECT id FROM public.categories WHERE slug = 'bedroom-furniture'),
  '2-door wardrobe with geometric panels',
  'Acacia Wood / Metal',
  '90×45×180 cm',
  320,
  768,
  5,
  56,
  true,
  false,
  24
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFCOLCAA1425',
  'Luni Chest of Drawers',
  'luni-chest-of-drawers',
  (SELECT id FROM public.categories WHERE slug = 'bedroom-furniture'),
  '3-drawer bedside chest, Luni collection',
  'Acacia Wood / Metal',
  '45×40×55 cm',
  145,
  348,
  12,
  14,
  true,
  false,
  25
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFBDKMN1440',
  'Platform Bed Frame King',
  'platform-bed-frame-king',
  (SELECT id FROM public.categories WHERE slug = 'bedroom-furniture'),
  'King size platform bed with rattan headboard',
  'Mango Wood / Metal',
  '200×180×100 cm',
  380,
  912,
  4,
  56,
  true,
  false,
  26
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFWDICAN1500',
  'Writing Desk Industrial',
  'writing-desk-industrial',
  (SELECT id FROM public.categories WHERE slug = 'writing-desks'),
  'Industrial style writing desk with drawers',
  'Acacia Wood / Metal',
  '120×60×76 cm',
  185,
  444,
  10,
  14,
  true,
  false,
  27
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFCFBTCA1700',
  'Bistro Round Table',
  'bistro-round-table',
  (SELECT id FROM public.categories WHERE slug = 'contract-furniture'),
  'Classic bistro table for hospitality',
  'Acacia Wood / Cast Iron',
  '60×60×75 cm',
  85,
  204,
  30,
  14,
  true,
  false,
  28
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFDTOCAN1667',
  'Dining Table Set + Benches',
  'dining-table-set-benches',
  (SELECT id FROM public.categories WHERE slug = 'dining-sets'),
  'Table with 2 matching benches, A-frame legs',
  'Acacia Wood / Metal',
  '200×80×76 cm',
  420,
  1008,
  5,
  56,
  true,
  false,
  29
);

INSERT INTO public.products (sku, name, slug, category_id, description, materials, dimensions, trade_price, rrp, moq, lead_time_days, in_stock, featured, sort_order)
VALUES (
  'BFBMWCMN1600',
  'Mirror Wall Cabinet',
  'mirror-wall-cabinet',
  (SELECT id FROM public.categories WHERE slug = 'bathroom-furniture'),
  'Bathroom mirror cabinet, 3 shelves',
  'Mango Wood',
  '60×15×45 cm',
  55,
  132,
  30,
  14,
  true,
  false,
  30
);

-- Done! 30 products seeded.
