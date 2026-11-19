-- =============================================================================
-- DULCE HORNO - Supabase Complete Schema (Single File)
-- Schema: dulcehorno
-- Ejecutar en: Supabase Dashboard > SQL Editor > New Query
-- =============================================================================

-- Crear schema dulcehorno
CREATE SCHEMA IF NOT EXISTS dulcehorno;
SET search_path TO dulcehorno, public;

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- =============================================================================
-- ENUMS (idempotent - safe to run multiple times)
-- =============================================================================

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'pending', 'confirmed', 'preparing', 'ready_pickup', 'ready_delivery',
    'out_for_delivery', 'delivered', 'completed', 'cancelled', 'failed'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM (
    'pending', 'authorized', 'paid', 'partial', 'refunded', 'failed'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM (
    'pago_movil', 'efectivo', 'zelle', 'usdt'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE delivery_type AS ENUM ('pickup', 'delivery');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE slot_type AS ENUM ('pickup', 'delivery');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'b2b_customer', 'staff', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =============================================================================
-- TABLAS DE CATÁLOGO
-- =============================================================================

CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        VARCHAR(100) NOT NULL UNIQUE,
  name        VARCHAR(100) NOT NULL,
  icon        VARCHAR(50),
  description TEXT,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subcategories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  slug          VARCHAR(100) NOT NULL,
  name          VARCHAR(100) NOT NULL,
  description   TEXT,
  sort_order    INT DEFAULT 0,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

CREATE TABLE IF NOT EXISTS products (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                    VARCHAR(150) NOT NULL UNIQUE,
  name                    VARCHAR(200) NOT NULL,
  short_description       VARCHAR(500),
  description             TEXT,
  category_id             UUID NOT NULL REFERENCES categories(id),
  subcategory_id          UUID REFERENCES subcategories(id),
  unit                    VARCHAR(50) NOT NULL DEFAULT 'unidad',
  base_price_cents        INT NOT NULL,
  compare_at_price_cents  INT,
  sku                     VARCHAR(100) UNIQUE,
  barcode                 VARCHAR(50),
  weight_grams            INT,
  shelf_life_hours        INT DEFAULT 24,
  storage_instructions    TEXT,
  reheating_instructions  TEXT,
  is_daily_fresh          BOOLEAN DEFAULT FALSE,
  is_active               BOOLEAN DEFAULT TRUE,
  is_featured             BOOLEAN DEFAULT FALSE,
  badge                   VARCHAR(50),
  sort_order              INT DEFAULT 0,
  meta_title              VARCHAR(200),
  meta_description        VARCHAR(300),
  search_vector           TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('spanish', coalesce(name,'') || ' ' || coalesce(short_description,'') || ' ' || coalesce(description,''))
  ) STORED,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW(),
  deleted_at              TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_daily_fresh ON products(is_daily_fresh) WHERE is_daily_fresh = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN(search_vector);

CREATE TABLE IF NOT EXISTS product_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         VARCHAR(500) NOT NULL,
  alt_text    VARCHAR(200),
  sort_order  INT DEFAULT 0,
  is_primary  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_primary ON product_images(product_id, is_primary) WHERE is_primary = TRUE;

CREATE TABLE IF NOT EXISTS allergens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        VARCHAR(50) NOT NULL UNIQUE,
  name        VARCHAR(100) NOT NULL,
  icon        VARCHAR(50),
  severity    VARCHAR(20) DEFAULT 'medium',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_allergens (
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  allergen_id UUID NOT NULL REFERENCES allergens(id) ON DELETE CASCADE,
  note        VARCHAR(200),
  PRIMARY KEY (product_id, allergen_id)
);

CREATE TABLE IF NOT EXISTS ingredients (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(200) NOT NULL UNIQUE,
  category    VARCHAR(50),
  is_organic  BOOLEAN DEFAULT FALSE,
  origin      VARCHAR(200),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_ingredients (
  product_id     UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  ingredient_id  UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity       VARCHAR(100),
  sort_order     INT DEFAULT 0,
  is_highlighted BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (product_id, ingredient_id)
);

CREATE TABLE IF NOT EXISTS nutrition_info (
  product_id     UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  calories_kcal  INT NOT NULL,
  protein_g      DECIMAL(6,2) NOT NULL,
  carbs_g        DECIMAL(6,2) NOT NULL,
  fat_g          DECIMAL(6,2) NOT NULL,
  fiber_g        DECIMAL(6,2),
  sugar_g        DECIMAL(6,2),
  salt_g         DECIMAL(6,2),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS b2b_pricing_tiers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tier_name    VARCHAR(50) NOT NULL,
  min_quantity INT NOT NULL,
  max_quantity INT,
  price_cents  INT NOT NULL,
  sort_order   INT DEFAULT 0,
  UNIQUE(product_id, min_quantity)
);

CREATE TABLE IF NOT EXISTS daily_stock (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id     UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  date           DATE NOT NULL,
  baked_quantity INT NOT NULL DEFAULT 0,
  sold_quantity  INT NOT NULL DEFAULT 0,
  reserved_b2b   INT NOT NULL DEFAULT 0,
  available      INT GENERATED ALWAYS AS (baked_quantity - sold_quantity - reserved_b2b) STORED,
  status         VARCHAR(20) GENERATED ALWAYS AS (
    CASE
      WHEN baked_quantity - sold_quantity - reserved_b2b <= 0 THEN 'sold_out'
      WHEN baked_quantity - sold_quantity - reserved_b2b <= 5 THEN 'low'
      ELSE 'available'
    END
  ) STORED,
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, date)
);
CREATE INDEX IF NOT EXISTS idx_daily_stock_date ON daily_stock(date);
CREATE INDEX IF NOT EXISTS idx_daily_stock_status ON daily_stock(status);

-- =============================================================================
-- LOGÍSTICA: ZONAS Y FRANJAS
-- =============================================================================

CREATE TABLE IF NOT EXISTS delivery_zones (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             VARCHAR(100) NOT NULL,
  postal_codes     TEXT[] NOT NULL,
  fee_cents        INT NOT NULL DEFAULT 0,
  min_order_cents  INT NOT NULL DEFAULT 0,
  estimated_time_min INT DEFAULT 30,
  is_active        BOOLEAN DEFAULT TRUE,
  sort_order       INT DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_delivery_zones_postal_codes ON delivery_zones USING GIN(postal_codes);

CREATE TABLE IF NOT EXISTS delivery_slots (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              VARCHAR(100) NOT NULL,
  type              slot_type NOT NULL,
  zone_id           UUID REFERENCES delivery_zones(id),
  start_time        TIME NOT NULL,
  end_time          TIME NOT NULL,
  cutoff_time       TIME NOT NULL,
  max_orders        INT NOT NULL DEFAULT 50,
  max_items         INT NOT NULL DEFAULT 200,
  days_of_week      INT[] DEFAULT '{0,1,2,3,4,5,6}',
  is_active         BOOLEAN DEFAULT TRUE,
  sort_order        INT DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS slot_availability (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id       UUID NOT NULL REFERENCES delivery_slots(id) ON DELETE CASCADE,
  date          DATE NOT NULL,
  orders_count  INT NOT NULL DEFAULT 0,
  items_count   INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(slot_id, date)
);
CREATE INDEX IF NOT EXISTS idx_slot_availability_date ON slot_availability(date);

-- =============================================================================
-- USUARIOS (integración con Supabase Auth)
-- =============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                 VARCHAR(255) NOT NULL,
  phone                 VARCHAR(30),
  first_name            VARCHAR(100) NOT NULL,
  last_name             VARCHAR(100) NOT NULL,
  role                  user_role NOT NULL DEFAULT 'customer',
  whatsapp_opt_in       BOOLEAN DEFAULT FALSE,
  whatsapp_verified     BOOLEAN DEFAULT FALSE,
  last_login_at         TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS b2b_profiles (
  user_id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name          VARCHAR(200) NOT NULL,
  trade_name            VARCHAR(200),
  cif_nif               VARCHAR(20) NOT NULL UNIQUE,
  address               VARCHAR(300) NOT NULL,
  city                  VARCHAR(100) NOT NULL,
  postal_code           VARCHAR(10) NOT NULL,
  province              VARCHAR(100),
  country               VARCHAR(2) DEFAULT 'ES',
  contact_person        VARCHAR(150),
  contact_email         VARCHAR(255),
  contact_phone         VARCHAR(30),
  payment_terms_days    INT DEFAULT 30,
  credit_limit_cents    INT DEFAULT 0,
  discount_percentage   DECIMAL(5,2) DEFAULT 0,
  is_approved           BOOLEAN DEFAULT FALSE,
  approved_at           TIMESTAMPTZ,
  approved_by           UUID REFERENCES auth.users(id),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS addresses (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type                VARCHAR(20) DEFAULT 'delivery',
  name                VARCHAR(100),
  first_name          VARCHAR(100),
  last_name           VARCHAR(100),
  company             VARCHAR(200),
  address_line1       VARCHAR(300) NOT NULL,
  address_line2       VARCHAR(300),
  city                VARCHAR(100) NOT NULL,
  province            VARCHAR(100),
  postal_code         VARCHAR(10) NOT NULL,
  country             VARCHAR(2) DEFAULT 'ES',
  phone               VARCHAR(30),
  instructions        TEXT,
  is_default          BOOLEAN DEFAULT FALSE,
  delivery_zone_id    UUID REFERENCES delivery_zones(id),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_default ON addresses(user_id, is_default) WHERE is_default = TRUE;

-- =============================================================================
-- PEDIDOS
-- =============================================================================

CREATE TABLE IF NOT EXISTS orders (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number           VARCHAR(30) NOT NULL UNIQUE,
  user_id                UUID NOT NULL REFERENCES auth.users(id),
  status                 order_status NOT NULL DEFAULT 'pending',
  payment_status         payment_status NOT NULL DEFAULT 'pending',
  payment_method         payment_method,
  delivery_type          delivery_type NOT NULL,
  delivery_zone_id       UUID REFERENCES delivery_zones(id),
  delivery_slot_id       UUID REFERENCES delivery_slots(id),
  delivery_address_id    UUID REFERENCES addresses(id),
  
  order_date             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at           TIMESTAMPTZ,
  preparing_at           TIMESTAMPTZ,
  ready_at               TIMESTAMPTZ,
  dispatched_at          TIMESTAMPTZ,
  delivered_at           TIMESTAMPTZ,
  completed_at           TIMESTAMPTZ,
  cancelled_at           TIMESTAMPTZ,
  
  subtotal_cents         INT NOT NULL DEFAULT 0,
  discount_cents         INT NOT NULL DEFAULT 0,
  delivery_fee_cents     INT NOT NULL DEFAULT 0,
  tax_cents              INT NOT NULL DEFAULT 0,
  total_cents            INT NOT NULL DEFAULT 0,
  paid_cents             INT NOT NULL DEFAULT 0,
  
  invoice_number         VARCHAR(50),
  invoice_date           DATE,
  invoice_due_date       DATE,
  invoice_pdf_url        VARCHAR(500),
  
  customer_notes         TEXT,
  internal_notes         TEXT,
  cancellation_reason    TEXT,
  
  ip_address             INET,
  user_agent             TEXT,
  referrer               VARCHAR(500),
  utm_source             VARCHAR(100),
  utm_medium             VARCHAR(100),
  utm_campaign           VARCHAR(100),
  
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW(),
  deleted_at             TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_slot ON orders(delivery_slot_id, delivery_type);

CREATE TABLE IF NOT EXISTS order_items (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id               UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id             UUID NOT NULL REFERENCES products(id),
  product_slug           VARCHAR(150) NOT NULL,
  product_name           VARCHAR(200) NOT NULL,
  unit                   VARCHAR(50) NOT NULL,
  quantity               INT NOT NULL DEFAULT 1,
  unit_price_cents       INT NOT NULL,
  total_price_cents      INT NOT NULL,
  tax_rate               DECIMAL(5,2) DEFAULT 10.00,
  tax_cents              INT NOT NULL DEFAULT 0,
  notes                  TEXT,
  created_at             TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

CREATE TABLE IF NOT EXISTS order_status_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status     order_status,
  to_status       order_status NOT NULL,
  changed_by      UUID REFERENCES auth.users(id),
  reason          TEXT,
  metadata        JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON order_status_history(order_id);

-- =============================================================================
-- PAGOS
-- =============================================================================

CREATE TABLE IF NOT EXISTS payments (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id                 UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payment_method           payment_method NOT NULL,
  provider                 VARCHAR(50),
  provider_payment_id      VARCHAR(200),
  amount_cents             INT NOT NULL,
  currency                 VARCHAR(3) DEFAULT 'EUR',
  status                   payment_status NOT NULL DEFAULT 'pending',
  authorized_at            TIMESTAMPTZ,
  captured_at              TIMESTAMPTZ,
  refunded_at              TIMESTAMPTZ,
  refunded_amount_cents    INT DEFAULT 0,
  failure_reason           TEXT,
  metadata                 JSONB,
  created_at               TIMESTAMPTZ DEFAULT NOW(),
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_id ON payments(provider_payment_id);

-- =============================================================================
-- CARRITO Y FAVORITOS
-- =============================================================================

CREATE TABLE IF NOT EXISTS carts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id    VARCHAR(255),
  expires_at    TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_carts_user ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_session ON carts(session_id);
CREATE INDEX IF NOT EXISTS idx_carts_expires ON carts(expires_at);

CREATE TABLE IF NOT EXISTS cart_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id           UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id        UUID NOT NULL REFERENCES products(id),
  quantity          INT NOT NULL DEFAULT 1,
  unit_price_cents  INT NOT NULL,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, product_id)
);

CREATE TABLE IF NOT EXISTS favorites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);

-- =============================================================================
-- B2B: PEDIDOS RECURRENTES (STANDING ORDERS)
-- =============================================================================

CREATE TABLE IF NOT EXISTS standing_orders (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name                   VARCHAR(100) NOT NULL,
  frequency              VARCHAR(20) NOT NULL,
  day_of_week            INT,
  day_of_month           INT,
  next_generation_date   DATE NOT NULL,
  delivery_type          delivery_type NOT NULL,
  delivery_zone_id       UUID REFERENCES delivery_zones(id),
  delivery_slot_id       UUID REFERENCES delivery_slots(id),
  delivery_address_id    UUID REFERENCES addresses(id),
  payment_method         payment_method NOT NULL DEFAULT 'pago_movil',
  is_active              BOOLEAN DEFAULT TRUE,
  pause_until            DATE,
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_standing_orders_next_gen ON standing_orders(next_generation_date) WHERE is_active = TRUE;

CREATE TABLE IF NOT EXISTS standing_order_items (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  standing_order_id       UUID NOT NULL REFERENCES standing_orders(id) ON DELETE CASCADE,
  product_id              UUID NOT NULL REFERENCES products(id),
  quantity                INT NOT NULL DEFAULT 1,
  unit_price_cents        INT NOT NULL,
  notes                   TEXT,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- NOTIFICACIONES / WHATSAPP
-- =============================================================================

CREATE TABLE IF NOT EXISTS notification_templates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            VARCHAR(50) NOT NULL UNIQUE,
  channel         VARCHAR(20) NOT NULL DEFAULT 'whatsapp',
  subject         VARCHAR(200),
  body_template   TEXT NOT NULL,
  variables       JSONB,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id             UUID REFERENCES orders(id) ON DELETE SET NULL,
  template_id          UUID REFERENCES notification_templates(id),
  channel              VARCHAR(20) NOT NULL,
  recipient            VARCHAR(255) NOT NULL,
  subject              VARCHAR(200),
  body                 TEXT NOT NULL,
  status               VARCHAR(20) DEFAULT 'pending',
  provider_message_id  VARCHAR(200),
  sent_at              TIMESTAMPTZ,
  delivered_at         TIMESTAMPTZ,
  read_at              TIMESTAMPTZ,
  failed_at            TIMESTAMPTZ,
  failure_reason       TEXT,
  retry_count          INT DEFAULT 0,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_order ON notifications(order_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);

-- =============================================================================
-- RESEÑAS
-- =============================================================================

CREATE TABLE IF NOT EXISTS reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_id        UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating          INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title           VARCHAR(200),
  body            TEXT,
  is_verified     BOOLEAN DEFAULT FALSE,
  is_published    BOOLEAN DEFAULT TRUE,
  helpful_count   INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, order_id)
);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_published ON reviews(is_published) WHERE is_published = TRUE;

-- =============================================================================
-- CONFIGURACIÓN
-- =============================================================================

CREATE TABLE IF NOT EXISTS settings (
  key          VARCHAR(100) PRIMARY KEY,
  value        JSONB NOT NULL,
  description  TEXT,
  is_public    BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- VISTAS
-- =============================================================================

CREATE OR REPLACE VIEW v_products_today AS
SELECT 
  p.*,
  COALESCE(ds.available, 0) AS today_stock,
  COALESCE(ds.status, 'available') AS today_status,
  pi.url AS primary_image
FROM products p
LEFT JOIN daily_stock ds ON ds.product_id = p.id AND ds.date = CURRENT_DATE
LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = TRUE
WHERE p.is_active = TRUE;

CREATE OR REPLACE VIEW v_slots_availability AS
SELECT 
  ds.*,
  sa.orders_count,
  sa.items_count,
  (sa.orders_count >= ds.max_orders OR sa.items_count >= ds.max_items) AS is_full,
  (ds.max_orders - sa.orders_count) AS remaining_orders,
  (ds.max_items - sa.items_count) AS remaining_items
FROM delivery_slots ds
LEFT JOIN slot_availability sa ON sa.slot_id = ds.id AND sa.date = CURRENT_DATE
WHERE ds.is_active = TRUE
  AND (ds.days_of_week @> ARRAY[EXTRACT(DOW FROM CURRENT_DATE)::INT])
ORDER BY ds.type, ds.start_time;

CREATE OR REPLACE VIEW v_orders_summary AS
SELECT 
  o.*,
  p.email,
  p.first_name,
  p.last_name,
  p.phone,
  COUNT(oi.id) AS items_count,
  SUM(oi.quantity) AS total_quantity
FROM orders o
JOIN profiles p ON p.id = o.user_id
LEFT JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, p.id;

-- =============================================================================
-- FUNCIONES Y TRIGGERS
-- =============================================================================

-- updated_at auto
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
DECLARE
  t record;
BEGIN
  FOR t IN 
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'dulcehorno' 
    AND tablename IN (
      'categories','subcategories','products','product_images','allergens',
      'ingredients','nutrition_info','b2b_pricing_tiers','daily_stock',
      'delivery_zones','delivery_slots','profiles','b2b_profiles','addresses',
      'orders','order_items','payments','carts','cart_items','favorites',
      'standing_orders','standing_order_items','notification_templates',
      'notifications','reviews','settings'
    )
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%I_updated_at ON dulcehorno.%I;
      CREATE TRIGGER update_%I_updated_at
        BEFORE UPDATE ON dulcehorno.%I
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    ', t.tablename, t.tablename, t.tablename, t.tablename);
  END LOOP;
END $$;

-- Trigger: crear perfil al registrarse
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: crear perfil al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO dulcehorno.profiles (id, email, phone, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: número de pedido automático
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  prefix TEXT := 'DH-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-';
  last_num INT;
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    SELECT COALESCE(MAX(SUBSTRING(order_number FROM prefix || '(\d+)$')::INT), 0) + 1
    INTO last_num
    FROM dulcehorno.orders
    WHERE order_number LIKE prefix || '%';
    NEW.order_number := prefix || LPAD(last_num::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_generate_order_number ON dulcehorno.orders;
CREATE TRIGGER trigger_generate_order_number
  BEFORE INSERT ON dulcehorno.orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Trigger: log estado pedido
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO dulcehorno.order_status_history (order_id, from_status, to_status, changed_by, reason)
    VALUES (NEW.id, OLD.status, NEW.status, 
      NULLIF(current_setting('request.jwt.claims', TRUE)::JSONB->>'sub', '')::UUID,
      current_setting('app.status_change_reason', TRUE)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_order_status_change ON dulcehorno.orders;
CREATE TRIGGER trigger_log_order_status_change
  AFTER UPDATE OF status ON dulcehorno.orders
  FOR EACH ROW EXECUTE FUNCTION log_order_status_change();

-- Función helper: stock disponible
CREATE OR REPLACE FUNCTION get_available_stock(p_product_id UUID, p_date DATE DEFAULT CURRENT_DATE)
RETURNS INT AS $$
DECLARE
  v_available INT;
BEGIN
  SELECT COALESCE(available, 0) INTO v_available
  FROM dulcehorno.daily_stock
  WHERE product_id = p_product_id AND date = p_date;
  RETURN COALESCE(v_available, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función helper: zona por código postal
CREATE OR REPLACE FUNCTION get_zone_by_postal_code(p_postal_code TEXT)
RETURNS UUID AS $$
DECLARE
  v_zone_id UUID;
BEGIN
  SELECT id INTO v_zone_id
  FROM dulcehorno.delivery_zones
  WHERE is_active = TRUE
    AND p_postal_code = ANY(postal_codes)
  ORDER BY sort_order
  LIMIT 1;
  RETURN v_zone_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) - SUPABASE AUTH
-- =============================================================================

ALTER TABLE dulcehorno.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dulcehorno.b2b_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dulcehorno.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE dulcehorno.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE dulcehorno.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE dulcehorno.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE dulcehorno.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE dulcehorno.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE dulcehorno.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE dulcehorno.standing_orders ENABLE ROW LEVEL SECURITY;
-- RLS Policies (idempotent)
-- =============================================================================

-- profiles
DROP POLICY IF EXISTS "Users can view own profile" ON dulcehorno.profiles;
CREATE POLICY "Users can view own profile" ON dulcehorno.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON dulcehorno.profiles;
CREATE POLICY "Users can update own profile" ON dulcehorno.profiles
  FOR UPDATE USING (auth.uid() = id);

-- b2b_profiles
DROP POLICY IF EXISTS "Users can view own b2b profile" ON dulcehorno.b2b_profiles;
CREATE POLICY "Users can view own b2b profile" ON dulcehorno.b2b_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- addresses
DROP POLICY IF EXISTS "Users can manage own addresses" ON dulcehorno.addresses;
CREATE POLICY "Users can manage own addresses" ON dulcehorno.addresses
  FOR ALL USING (auth.uid() = user_id);

-- orders
DROP POLICY IF EXISTS "Users can view own orders" ON dulcehorno.orders;
CREATE POLICY "Users can view own orders" ON dulcehorno.orders
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create orders" ON dulcehorno.orders;
CREATE POLICY "Users can create orders" ON dulcehorno.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Staff can view all orders" ON dulcehorno.orders;
CREATE POLICY "Staff can view all orders" ON dulcehorno.orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM dulcehorno.profiles WHERE id = auth.uid() AND role IN ('staff','admin'))
  );

-- order_items
DROP POLICY IF EXISTS "Users can view own order items" ON dulcehorno.order_items;
CREATE POLICY "Users can view own order items" ON dulcehorno.order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM dulcehorno.orders WHERE user_id = auth.uid())
  );

-- payments
DROP POLICY IF EXISTS "Users can view own payments" ON dulcehorno.payments;
CREATE POLICY "Users can view own payments" ON dulcehorno.payments
  FOR SELECT USING (
    order_id IN (SELECT id FROM dulcehorno.orders WHERE user_id = auth.uid())
  );

-- carts
DROP POLICY IF EXISTS "Users can manage own cart" ON dulcehorno.carts;
CREATE POLICY "Users can manage own cart" ON dulcehorno.carts
  FOR ALL USING (auth.uid() = user_id OR session_id = current_setting('app.session_id', TRUE));

-- cart_items
DROP POLICY IF EXISTS "Users can manage own cart items" ON dulcehorno.cart_items;
CREATE POLICY "Users can manage own cart items" ON dulcehorno.cart_items
  FOR ALL USING (
    cart_id IN (SELECT id FROM dulcehorno.carts WHERE user_id = auth.uid() OR session_id = current_setting('app.session_id', TRUE))
  );

-- favorites
DROP POLICY IF EXISTS "Users can manage own favorites" ON dulcehorno.favorites;
CREATE POLICY "Users can manage own favorites" ON dulcehorno.favorites
  FOR ALL USING (auth.uid() = user_id);

-- standing_orders
DROP POLICY IF EXISTS "Users can manage own standing orders" ON dulcehorno.standing_orders;
CREATE POLICY "Users can manage own standing orders" ON dulcehorno.standing_orders
  FOR ALL USING (auth.uid() = user_id);

-- notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON dulcehorno.notifications;
CREATE POLICY "Users can view own notifications" ON dulcehorno.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- reviews
DROP POLICY IF EXISTS "Users can manage own reviews" ON dulcehorno.reviews;
CREATE POLICY "Users can manage own reviews" ON dulcehorno.reviews
  FOR ALL USING (auth.uid() = user_id);

-- Public read policies
DROP POLICY IF EXISTS "Public read active products" ON dulcehorno.products;
CREATE POLICY "Public read active products" ON dulcehorno.products
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public read active categories" ON dulcehorno.categories;
CREATE POLICY "Public read active categories" ON dulcehorno.categories
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public read active subcategories" ON dulcehorno.subcategories;
CREATE POLICY "Public read active subcategories" ON dulcehorno.subcategories
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public read product images" ON dulcehorno.product_images;
CREATE POLICY "Public read product images" ON dulcehorno.product_images
  FOR SELECT USING (EXISTS (SELECT 1 FROM dulcehorno.products WHERE id = product_id AND is_active = TRUE));

DROP POLICY IF EXISTS "Public read active delivery zones" ON dulcehorno.delivery_zones;
CREATE POLICY "Public read active delivery zones" ON dulcehorno.delivery_zones
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public read active delivery slots" ON dulcehorno.delivery_slots;
CREATE POLICY "Public read active delivery slots" ON dulcehorno.delivery_slots
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public read slot availability" ON dulcehorno.slot_availability;
CREATE POLICY "Public read slot availability" ON dulcehorno.slot_availability
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read published reviews" ON dulcehorno.reviews;
CREATE POLICY "Public read published reviews" ON dulcehorno.reviews
  FOR SELECT USING (is_published = TRUE);

DROP POLICY IF EXISTS "Public read settings" ON dulcehorno.settings;
CREATE POLICY "Public read settings" ON dulcehorno.settings
  FOR SELECT USING (is_public = TRUE);

-- =============================================================================
-- REALTIME (idempotent)
-- =============================================================================

DO $$
DECLARE
  tables_to_add text[] := ARRAY['orders', 'order_items', 'payments', 'notifications', 'daily_stock', 'slot_availability'];
  t text;
BEGIN
  FOREACH t IN ARRAY tables_to_add
  LOOP
    -- Check if table is already in publication
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'dulcehorno' 
      AND tablename = t
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE dulcehorno.%I', t);
    END IF;
  END LOOP;
END $$;

ALTER TABLE dulcehorno.orders REPLICA IDENTITY FULL;
ALTER TABLE dulcehorno.order_items REPLICA IDENTITY FULL;
ALTER TABLE dulcehorno.payments REPLICA IDENTITY FULL;
ALTER TABLE dulcehorno.notifications REPLICA IDENTITY FULL;
ALTER TABLE dulcehorno.daily_stock REPLICA IDENTITY FULL;
ALTER TABLE dulcehorno.slot_availability REPLICA IDENTITY FULL;

-- =============================================================================
-- SEED DATA
-- =============================================================================

INSERT INTO dulcehorno.categories (slug, name, icon, description, sort_order) VALUES
('viennoiserie', 'Viennoiserie', 'croissant', 'Croissants, pains au chocolat, brioches y masas laminadas', 1),
('tartas', 'Tartas y bizcochos', 'gift', 'Tartas de fruta, queso, bizcochos y postres de cuchara', 2),
('pan', 'Pan artesanal', 'wheat', 'Pan de masa madre, integral, rústico y especialidades', 3),
('galletas', 'Galletas', 'cookie', 'Galletas artesanales, cookies y barritas', 4),
('estacional', 'Estacional', 'sparkles', 'Productos de temporada: roscón, panettone, monas...', 5),
('bebidas', 'Bebidas', 'coffee', 'Café de especialidad, té, matcha y otras bebidas', 6)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO dulcehorno.subcategories (category_id, slug, name, sort_order) VALUES
((SELECT id FROM dulcehorno.categories WHERE slug='viennoiserie'), 'croissants', 'Croissants', 1),
((SELECT id FROM dulcehorno.categories WHERE slug='viennoiserie'), 'tradicionales', 'Tradicionales', 2),
((SELECT id FROM dulcehorno.categories WHERE slug='tartas'), 'fruta', 'De fruta', 1),
((SELECT id FROM dulcehorno.categories WHERE slug='tartas'), 'queso', 'De queso', 2),
((SELECT id FROM dulcehorno.categories WHERE slug='tartas'), 'bizcochos', 'Bizcochos', 3),
((SELECT id FROM dulcehorno.categories WHERE slug='pan'), 'masa-madre', 'Masa madre', 1),
((SELECT id FROM dulcehorno.categories WHERE slug='galletas'), 'tradicionales', 'Tradicionales', 1),
((SELECT id FROM dulcehorno.categories WHERE slug='estacional'), 'navidad', 'Navidad', 1),
((SELECT id FROM dulcehorno.categories WHERE slug='bebidas'), 'cafe', 'Café', 1),
((SELECT id FROM dulcehorno.categories WHERE slug='bebidas'), 'te', 'Té e infusiones', 2)
ON CONFLICT (category_id, slug) DO NOTHING;

INSERT INTO dulcehorno.allergens (code, name, severity) VALUES
('gluten', 'Gluten', 'high'),
('lactosa', 'Lactosa', 'medium'),
('huevo', 'Huevo', 'high'),
('frutos_secos', 'Frutos secos', 'critical'),
('cacahuetes', 'Cacahuetes', 'critical'),
('soja', 'Soja', 'medium'),
('sesamo', 'Sésamo', 'high'),
('mostaza', 'Mostaza', 'medium'),
('apio', 'Apio', 'medium'),
('sulfitos', 'Sulfitos', 'low'),
('altramuces', 'Altramuces', 'medium'),
('moluscos', 'Moluscos', 'high'),
('crustaceos', 'Crustáceos', 'high'),
('pescado', 'Pescado', 'high')
ON CONFLICT (code) DO NOTHING;

INSERT INTO dulcehorno.delivery_zones (name, postal_codes, fee_cents, min_order_cents, estimated_time_min, sort_order) VALUES
('Centro', ARRAY['28001','28002','28003','28004','28005','28006','28007','28008','28009','28010'], 350, 1500, 30, 1),
('Norte', ARRAY['28015','28016','28017','28018','28019','28020','28021','28022','28023','28024'], 450, 2000, 40, 2),
('Sur', ARRAY['28025','28026','28027','28028','28029','28030','28031','28032','28033','28034'], 450, 2000, 40, 3),
('Este', ARRAY['28011','28012','28013','28014','28015'], 400, 1800, 35, 4),
('Oeste', ARRAY['28006','28007','28008','28009'], 400, 1800, 35, 5)
ON CONFLICT DO NOTHING;

INSERT INTO dulcehorno.delivery_slots (name, type, start_time, end_time, cutoff_time, max_orders, max_items, days_of_week, sort_order) VALUES
('Recogida mañana 09:00-11:00', 'pickup', '09:00', '11:00', '10:00', 50, 200, '{1,2,3,4,5,6}', 1),
('Recogida mediodía 12:00-14:00', 'pickup', '12:00', '14:00', '11:00', 40, 150, '{1,2,3,4,5,6}', 2),
('Recogida tarde 17:00-19:00', 'pickup', '17:00', '19:00', '16:00', 30, 100, '{1,2,3,4,5}', 3),
('Delivery mañana 09:30-12:00', 'delivery', '09:30', '12:00', '10:00', 20, 80, '{1,2,3,4,5,6}', 4),
('Delivery mediodía 12:30-14:30', 'delivery', '12:30', '14:30', '11:30', 15, 60, '{1,2,3,4,5,6}', 5),
('Delivery tarde 17:30-19:30', 'delivery', '17:30', '19:30', '16:30', 15, 60, '{1,2,3,4,5}', 6)
ON CONFLICT DO NOTHING;

INSERT INTO dulcehorno.settings (key, value, description, is_public) VALUES
('shop_name', '"Dulce Horno"', 'Nombre de la pastelería', TRUE),
('shop_phone', '"+34 600 000 000"', 'Teléfono de contacto', TRUE),
('shop_email', '"hola@dulcehorno.es"', 'Email de contacto', TRUE),
('shop_address', '{"street": "Calle del Horno 15", "city": "Madrid", "postal_code": "28001"}', 'Dirección física', TRUE),
('whatsapp_number', '"34600000000"', 'Número WhatsApp Business', TRUE),
('currency', '"EUR"', 'Moneda', TRUE),
('tax_rate', '10', 'IVA por defecto (%)', TRUE),
('min_order_cents', '1500', 'Pedido mínimo general (céntimos)', TRUE),
('free_delivery_threshold_cents', '5000', 'Envío gratis a partir de (céntimos)', TRUE),
('order_cutoff_minutes', '60', 'Minutos antes de franja para cortar pedidos', FALSE),
('daily_bake_time', '"05:00"', 'Hora de horneado diario', TRUE),
('max_future_order_days', '7', 'Días máximos para pedir por adelantado', TRUE),
('stripe_publishable_key', '"pk_test_..."', 'Clave pública Stripe', TRUE)
ON CONFLICT (key) DO NOTHING;

INSERT INTO dulcehorno.notification_templates (code, channel, subject, body_template, variables) VALUES
('order_confirmed', 'whatsapp', 'Pedido confirmado',
  '¡Hola {{customer_name}}! 👋\n\nTu pedido *{{order_number}}* ha sido confirmado.\n\n📦 *Resumen:*\n{{#each items}}{{quantity}}x {{name}} ({{price}})\n{{/each}}\n\n💰 *Total: {{total}}*\n\n🕐 *Franja:* {{slot_name}}\n📍 *{{delivery_type}}*: {{address}}\n\nTe avisaremos cuando esté listo. ¡Gracias por confiar en Dulce Horno! 🥐',
  '{"customer_name": "string", "order_number": "string", "items": "[{quantity, name, price}]", "total": "string", "slot_name": "string", "delivery_type": "string", "address": "string"}'::JSONB),

('ready_pickup', 'whatsapp', 'Pedido listo para recoger',
  '¡Hola {{customer_name}}! ✨\n\nTu pedido *{{order_number}}* ya está listo para recoger en tienda.\n\n🕐 *Horario:* {{slot_start}}-{{slot_end}}\n📍 *Dirección:* {{shop_address}}\n\n¡Pásate cuando quieras! Tu pedido te espera fresquito 🥐',
  '{"customer_name": "string", "order_number": "string", "slot_start": "string", "slot_end": "string", "shop_address": "string"}'::JSONB),

('out_for_delivery', 'whatsapp', 'Pedido en camino',
  '¡Hola {{customer_name}}! 🚚\n\nTu pedido *{{order_number}}* ya está en camino.\n\n👤 *Repartidor:* {{driver_name}}\n📞 *Teléfono:* {{driver_phone}}\n🕐 *Llegada estimada:* {{eta}}\n\nPuedes seguir el envío en: {{tracking_url}}',
  '{"customer_name": "string", "order_number": "string", "driver_name": "string", "driver_phone": "string", "eta": "string", "tracking_url": "string"}'::JSONB),

('delivered', 'whatsapp', 'Pedido entregado',
  '¡Hola {{customer_name}}! ✅\n\nTu pedido *{{order_number}}* ha sido entregado correctamente.\n\nEsperamos que lo disfrutes mucho 😋\n\n¿Todo bien? Cuéntanos tu experiencia: {{review_url}}\n\n¡Hasta la próxima! 👋',
  '{"customer_name": "string", "order_number": "string", "review_url": "string"}'::JSONB),

('invoice_ready', 'whatsapp', 'Factura disponible',
  '¡Hola {{customer_name}}! 📄\n\nTu factura *{{invoice_number}}* del pedido *{{order_number}}* ya está disponible.\n\n💰 *Importe:* {{amount}}\n📅 *Vencimiento:* {{due_date}}\n\nDescárgala aquí: {{invoice_url}}\n\nGracias por tu confianza 🤝',
  '{"customer_name": "string", "invoice_number": "string", "order_number": "string", "amount": "string", "due_date": "string", "invoice_url": "string"}'::JSONB)
ON CONFLICT (code) DO NOTHING;

-- =============================================================================
-- RPC FUNCTIONS PARA CLIENTE
-- =============================================================================

CREATE OR REPLACE FUNCTION get_products_today(
  p_category_id UUID DEFAULT NULL,
  p_search TEXT DEFAULT NULL,
  p_limit INT DEFAULT 50,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  slug VARCHAR,
  name VARCHAR,
  short_description VARCHAR,
  category_id UUID,
  unit VARCHAR,
  base_price_cents INT,
  compare_at_price_cents INT,
  badge VARCHAR,
  is_daily_fresh BOOLEAN,
  today_stock INT,
  today_status VARCHAR,
  primary_image VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id, p.slug, p.name, p.short_description, p.category_id, p.unit,
    p.base_price_cents, p.compare_at_price_cents, p.badge, p.is_daily_fresh,
    COALESCE(ds.available, 0) AS today_stock,
    COALESCE(ds.status, 'available') AS today_status,
    pi.url AS primary_image
  FROM dulcehorno.products p
  LEFT JOIN dulcehorno.daily_stock ds ON ds.product_id = p.id AND ds.date = CURRENT_DATE
  LEFT JOIN dulcehorno.product_images pi ON pi.product_id = p.id AND pi.is_primary = TRUE
  WHERE p.is_active = TRUE
    AND (p_category_id IS NULL OR p.category_id = p_category_id)
    AND (p_search IS NULL OR p.search_vector @@ plainto_tsquery('spanish', p_search))
  ORDER BY p.is_featured DESC, p.sort_order, p.name
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_available_slots(
  p_date DATE DEFAULT CURRENT_DATE,
  p_delivery_type slot_type DEFAULT NULL,
  p_zone_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  type slot_type,
  zone_id UUID,
  start_time TIME,
  end_time TIME,
  cutoff_time TIME,
  max_orders INT,
  max_items INT,
  orders_count INT,
  items_count INT,
  is_full BOOLEAN,
  remaining_orders INT,
  remaining_items INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ds.id, ds.name, ds.type, ds.zone_id, ds.start_time, ds.end_time, ds.cutoff_time,
    ds.max_orders, ds.max_items,
    COALESCE(sa.orders_count, 0) AS orders_count,
    COALESCE(sa.items_count, 0) AS items_count,
    (COALESCE(sa.orders_count, 0) >= ds.max_orders OR COALESCE(sa.items_count, 0) >= ds.max_items) AS is_full,
    (ds.max_orders - COALESCE(sa.orders_count, 0)) AS remaining_orders,
    (ds.max_items - COALESCE(sa.items_count, 0)) AS remaining_items
  FROM dulcehorno.delivery_slots ds
  LEFT JOIN dulcehorno.slot_availability sa ON sa.slot_id = ds.id AND sa.date = p_date
  WHERE ds.is_active = TRUE
    AND (ds.days_of_week @> ARRAY[EXTRACT(DOW FROM p_date)::INT])
    AND (p_delivery_type IS NULL OR ds.type = p_delivery_type)
    AND (p_zone_id IS NULL OR ds.zone_id = p_zone_id OR ds.type = 'pickup')
  ORDER BY ds.type, ds.start_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION calculate_delivery_fee(
  p_postal_code TEXT,
  p_subtotal_cents INT
)
RETURNS TABLE (
  zone_id UUID,
  zone_name VARCHAR,
  fee_cents INT,
  min_order_cents INT,
  is_free_delivery BOOLEAN,
  estimated_time_min INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dz.id AS zone_id,
    dz.name AS zone_name,
    dz.fee_cents,
    dz.min_order_cents,
    (p_subtotal_cents >= 5000) AS is_free_delivery,
    dz.estimated_time_min
  FROM dulcehorno.delivery_zones dz
  WHERE dz.is_active = TRUE
    AND p_postal_code = ANY(dz.postal_codes)
  ORDER BY dz.sort_order
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION create_order_from_cart(
  p_user_id UUID,
  p_delivery_type delivery_type,
  p_delivery_slot_id UUID,
  p_delivery_address_id UUID,
  p_payment_method payment_method,
  p_customer_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_order_id UUID;
  v_cart_id UUID;
  v_subtotal INT := 0;
  v_delivery_fee INT := 0;
  v_tax INT := 0;
  v_total INT := 0;
  v_zone_id UUID;
BEGIN
  SELECT id INTO v_cart_id FROM dulcehorno.carts WHERE user_id = p_user_id AND expires_at > NOW() LIMIT 1;
  IF v_cart_id IS NULL THEN
    RAISE EXCEPTION 'Cart not found or expired';
  END IF;

  SELECT COALESCE(SUM(ci.quantity * ci.unit_price_cents), 0) INTO v_subtotal
  FROM dulcehorno.cart_items ci WHERE ci.cart_id = v_cart_id;

  IF p_delivery_type = 'delivery' THEN
    SELECT dz.fee_cents, dz.id INTO v_delivery_fee, v_zone_id
    FROM dulcehorno.delivery_slots ds
    JOIN dulcehorno.delivery_zones dz ON dz.id = ds.zone_id
    WHERE ds.id = p_delivery_slot_id;
  END IF;

  v_tax := ROUND((v_subtotal + v_delivery_fee) * 0.10);
  v_total := v_subtotal + v_delivery_fee + v_tax;

  INSERT INTO dulcehorno.orders (
    user_id, delivery_type, delivery_zone_id, delivery_slot_id,
    delivery_address_id, payment_method,
    subtotal_cents, delivery_fee_cents, tax_cents, total_cents,
    customer_notes, status, payment_status
  ) VALUES (
    p_user_id, p_delivery_type, v_zone_id, p_delivery_slot_id,
    p_delivery_address_id, p_payment_method,
    v_subtotal, v_delivery_fee, v_tax, v_total,
    p_customer_notes, 'pending', 'pending'
  ) RETURNING id INTO v_order_id;

  INSERT INTO dulcehorno.order_items (order_id, product_id, product_slug, product_name, unit, quantity, unit_price_cents, total_price_cents, tax_rate, tax_cents, notes)
  SELECT v_order_id, ci.product_id, p.slug, p.name, p.unit, ci.quantity, ci.unit_price_cents,
         (ci.quantity * ci.unit_price_cents), 10.00, ROUND((ci.quantity * ci.unit_price_cents) * 0.10), ci.notes
  FROM dulcehorno.cart_items ci
  JOIN dulcehorno.products p ON p.id = ci.product_id
  WHERE ci.cart_id = v_cart_id;

  DELETE FROM dulcehorno.cart_items WHERE cart_id = v_cart_id;
  DELETE FROM dulcehorno.carts WHERE id = v_cart_id;

  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- GRANTS
-- =============================================================================

GRANT USAGE ON SCHEMA dulcehorno TO anon, authenticated;
GRANT SELECT ON dulcehorno.categories, dulcehorno.subcategories, dulcehorno.products, dulcehorno.product_images, dulcehorno.delivery_zones, dulcehorno.delivery_slots, dulcehorno.slot_availability, dulcehorno.settings TO anon;
GRANT SELECT ON dulcehorno.reviews TO anon;
GRANT EXECUTE ON FUNCTION get_products_today, get_available_slots, calculate_delivery_fee TO anon;

GRANT ALL ON dulcehorno.profiles, dulcehorno.b2b_profiles, dulcehorno.addresses, dulcehorno.orders, dulcehorno.order_items, dulcehorno.payments, dulcehorno.carts, dulcehorno.cart_items, dulcehorno.favorites, dulcehorno.standing_orders, dulcehorno.standing_order_items, dulcehorno.notifications, dulcehorno.reviews TO authenticated;
GRANT EXECUTE ON FUNCTION create_order_from_cart TO authenticated;

-- =============================================================================
-- COMENTARIOS FINALES
-- =============================================================================

/*
ESTE ARCHIVO CREADO EL SCHEMA COMPLETO "dulcehorno" EN SUPABASE.

PARA EJECUTAR:
1. Ve a Supabase Dashboard > SQL Editor > New Query
2. Copia y pega TODO este contenido
3. Click "Run"

DESPUÉS DE EJECUTAR:

1. Database > Replication > Habilitar para:
   - dulcehorno.orders
   - dulcehorno.order_items  
   - dulcehorno.payments
   - dulcehorno.notifications
   - dulcehorno.daily_stock
   - dulcehorno.slot_availability

2. Authentication > Providers > Habilitar Email, Phone, OAuth

3. Storage > Crear buckets:
   - product-images (público)
   - invoices (privado)

4. Edge Functions para webhooks:
   - stripe-webhook
   - bizum-webhook
   - whatsapp-webhook
   - daily-stock-cron (CRON: 0 5 * * *)
   - standing-orders-cron (CRON: 0 6 * * 1)

5. Variables entorno Vercel:
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ... (solo server)
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   WHATSAPP_API_TOKEN=...
   WHATSAPP_PHONE_NUMBER_ID=...

RPC DISPONIBLES PARA NEXT.JS:
- get_products_today(p_category_id, p_search, p_limit, p_offset)
- get_available_slots(p_date, p_delivery_type, p_zone_id)
- calculate_delivery_fee(p_postal_code, p_subtotal_cents)
- create_order_from_cart(p_user_id, p_delivery_type, p_delivery_slot_id, p_delivery_address_id, p_payment_method, p_customer_notes)
*/
