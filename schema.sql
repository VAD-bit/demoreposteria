-- =============================================================================
-- DULCE HORNO - PostgreSQL Schema
-- Pastelería artesanal B2C + B2B (Horeca)
-- =============================================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- ENUMS Y TIPOS PERSONALIZADOS
-- =============================================================================

CREATE TYPE order_status AS ENUM (
  'pending',           -- Pedido creado, pendiente de confirmación
  'confirmed',         -- Confirmado por la pastelería
  'preparing',         -- En preparación (horneado)
  'ready_pickup',      -- Listo para recoger en tienda
  'ready_delivery',    -- Listo para delivery
  'out_for_delivery',  -- En ruta (delivery)
  'delivered',         -- Entregado
  'completed',         -- Completado (pagado y entregado)
  'cancelled',         -- Cancelado
  'failed'             -- Falló (pago, stock, etc.)
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'authorized',
  'paid',
  'partial',
  'refunded',
  'failed'
);

CREATE TYPE payment_method AS ENUM (
  'stripe_card',
  'bizum',
  'cash_on_pickup',
  'invoice_net30',
  'invoice_net60',
  'invoice_net90'
);

CREATE TYPE delivery_type AS ENUM (
  'pickup',
  'delivery'
);

CREATE TYPE user_role AS ENUM (
  'customer',
  'b2b_customer',
  'staff',
  'admin'
);

CREATE TYPE slot_type AS ENUM (
  'pickup',
  'delivery'
);

-- =============================================================================
-- TABLAS DE CATÁLOGO
-- =============================================================================

-- Categorías principales
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        VARCHAR(100) NOT NULL UNIQUE,
  name        VARCHAR(100) NOT NULL,
  icon        VARCHAR(50),           -- nombre del icono lucide
  description TEXT,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Subcategorías
CREATE TABLE subcategories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Productos
CREATE TABLE products (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                  VARCHAR(150) NOT NULL UNIQUE,
  name                  VARCHAR(200) NOT NULL,
  short_description     VARCHAR(500),
  description           TEXT,
  category_id           UUID NOT NULL REFERENCES categories(id),
  subcategory_id        UUID REFERENCES subcategories(id),
  unit                  VARCHAR(50) NOT NULL DEFAULT 'unidad',  -- unidad, pack 6 uds, tarta (8 pax), etc.
  base_price_cents      INT NOT NULL,                            -- precio base B2C en céntimos
  compare_at_price_cents INT,                                    -- precio tachado (oferta)
  sku                   VARCHAR(100) UNIQUE,
  barcode               VARCHAR(50),
  weight_grams          INT,
  shelf_life_hours      INT DEFAULT 24,                          -- vida útil en horas
  storage_instructions  TEXT,
  reheating_instructions TEXT,
  is_daily_fresh        BOOLEAN DEFAULT FALSE,                   -- se hornea cada día
  is_active             BOOLEAN DEFAULT TRUE,
  is_featured           BOOLEAN DEFAULT FALSE,
  badge                 VARCHAR(50),                             -- "Más vendido", "Nuevo", "Oferta", "Especial del día"
  sort_order            INT DEFAULT 0,
  meta_title            VARCHAR(200),
  meta_description      VARCHAR(300),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  deleted_at            TIMESTAMPTZ
);

-- Índices para productos
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_subcategory ON products(subcategory_id);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_products_daily_fresh ON products(is_daily_fresh) WHERE is_daily_fresh = TRUE;
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;

-- Imágenes de productos
CREATE TABLE product_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         VARCHAR(500) NOT NULL,
  alt_text    VARCHAR(200),
  sort_order  INT DEFAULT 0,
  is_primary  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_primary ON product_images(product_id, is_primary) WHERE is_primary = TRUE;

-- Alérgenos (maestro)
CREATE TABLE allergens (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code        VARCHAR(50) NOT NULL UNIQUE,     -- gluten, lactosa, huevo, frutos_secos, soja, sesamo, mostaza, apio, sulfitos, altramuces, moluscos, crustaceos, pescado, cacahuetes
  name        VARCHAR(100) NOT NULL,
  icon        VARCHAR(50),
  severity    VARCHAR(20) DEFAULT 'medium',    -- low, medium, high, critical
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Relación producto-alérgenos
CREATE TABLE product_allergens (
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  allergen_id UUID NOT NULL REFERENCES allergens(id) ON DELETE CASCADE,
  note        VARCHAR(200),                    -- "trazas", "contiene", "puede contener"
  PRIMARY KEY (product_id, allergen_id)
);

-- Ingredientes (maestro)
CREATE TABLE ingredients (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(200) NOT NULL UNIQUE,
  category    VARCHAR(50),                     -- harina, lácteo, azúcar, grasa, fruta, chocolate, etc.
  is_organic  BOOLEAN DEFAULT FALSE,
  origin      VARCHAR(200),                    -- "Galicia", "Etiopía Yirgacheffe", etc.
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Relación producto-ingredientes
CREATE TABLE product_ingredients (
  product_id     UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  ingredient_id  UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity       VARCHAR(100),                 -- "200g", "2 unidades", "al gusto"
  sort_order     INT DEFAULT 0,
  is_highlighted BOOLEAN DEFAULT FALSE,        -- para mostrar en lista principal
  PRIMARY KEY (product_id, ingredient_id)
);

-- Información nutricional (por 100g)
CREATE TABLE nutrition_info (
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

-- Precios B2B por escalones (tiers)
CREATE TABLE b2b_pricing_tiers (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id   UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tier_name    VARCHAR(50) NOT NULL,            -- "1-10 uds", "11-50 uds", "51+ uds"
  min_quantity INT NOT NULL,
  max_quantity INT,                              -- NULL = sin límite
  price_cents  INT NOT NULL,                     -- precio en céntimos para este tier
  sort_order   INT DEFAULT 0,
  PRIMARY KEY (product_id, min_quantity)
);

-- Stock diario (para productos de horneado diario)
CREATE TABLE daily_stock (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id     UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  date           DATE NOT NULL,
  baked_quantity INT NOT NULL DEFAULT 0,         -- cantidad horneada esta mañana
  sold_quantity  INT NOT NULL DEFAULT 0,          -- cantidad vendida/reservada
  reserved_b2b   INT NOT NULL DEFAULT 0,          -- reservado para canal Horeca
  available      INT GENERATED ALWAYS AS (baked_quantity - sold_quantity - reserved_b2b) STORED,
  status         VARCHAR(20) DEFAULT 'available', -- available, low, sold_out
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, date)
);

CREATE INDEX idx_daily_stock_date ON daily_stock(date);
CREATE INDEX idx_daily_stock_status ON daily_stock(status);

-- =============================================================================
-- ZONAS Y FRANJAS DE ENTREGA
-- =============================================================================

-- Zonas de entrega (por códigos postales)
CREATE TABLE delivery_zones (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(100) NOT NULL,
  postal_codes  TEXT[] NOT NULL,                 -- array de códigos postales: '{28001,28002,...}'
  fee_cents     INT NOT NULL DEFAULT 0,          -- coste envío en céntimos
  min_order_cents INT NOT NULL DEFAULT 0,        -- pedido mínimo en céntimos
  estimated_time_min INT DEFAULT 30,             -- tiempo estimado en minutos
  is_active     BOOLEAN DEFAULT TRUE,
  sort_order    INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- GIN index para búsqueda por código postal
CREATE INDEX idx_delivery_zones_postal_codes ON delivery_zones USING GIN(postal_codes);

-- Franjas horarias (slots)
CREATE TABLE delivery_slots (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             VARCHAR(100) NOT NULL,
  type             slot_type NOT NULL,            -- pickup | delivery
  zone_id          UUID REFERENCES delivery_zones(id),  -- NULL = todas las zonas (para pickup)
  start_time       TIME NOT NULL,
  end_time         TIME NOT NULL,
  cutoff_time      TIME NOT NULL,                 -- hora límite para pedir
  max_orders       INT NOT NULL DEFAULT 50,       -- máx pedidos en esta franja
  max_items        INT NOT NULL DEFAULT 200,      -- máx items en esta franja
  days_of_week     INT[] DEFAULT '{0,1,2,3,4,5,6}', -- 0=Domingo ... 6=Sábado
  is_active        BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Disponibilidad real por franja y fecha (se actualiza en tiempo real)
CREATE TABLE slot_availability (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slot_id          UUID NOT NULL REFERENCES delivery_slots(id) ON DELETE CASCADE,
  date             DATE NOT NULL,
  orders_count     INT NOT NULL DEFAULT 0,
  items_count      INT NOT NULL DEFAULT 0,
  is_full          BOOLEAN GENERATED ALWAYS AS (
    orders_count >= (SELECT max_orders FROM delivery_slots WHERE id = slot_id)
    OR items_count >= (SELECT max_items FROM delivery_slots WHERE id = slot_id)
  ) STORED,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(slot_id, date)
);

CREATE INDEX idx_slot_availability_date ON slot_availability(date);

-- =============================================================================
-- USUARIOS Y CLIENTES
-- =============================================================================

-- Usuarios (auth + perfil)
CREATE TABLE users (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email                 VARCHAR(255) NOT NULL UNIQUE,
  phone                 VARCHAR(30),
  password_hash         VARCHAR(255),              -- NULL si solo OAuth/WhatsApp
  first_name            VARCHAR(100) NOT NULL,
  last_name             VARCHAR(100) NOT NULL,
  role                  user_role NOT NULL DEFAULT 'customer',
  whatsapp_opt_in       BOOLEAN DEFAULT FALSE,
  whatsapp_verified     BOOLEAN DEFAULT FALSE,
  email_verified        BOOLEAN DEFAULT FALSE,
  last_login_at         TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  deleted_at            TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

-- Perfiles B2B (datos fiscales para facturación)
CREATE TABLE b2b_profiles (
  user_id                UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  company_name           VARCHAR(200) NOT NULL,
  trade_name             VARCHAR(200),            -- nombre comercial
  cif_nif                VARCHAR(20) NOT NULL UNIQUE,
  address                VARCHAR(300) NOT NULL,
  city                   VARCHAR(100) NOT NULL,
  postal_code            VARCHAR(10) NOT NULL,
  province               VARCHAR(100),
  country                VARCHAR(2) DEFAULT 'ES',
  contact_person         VARCHAR(150),
  contact_email          VARCHAR(255),
  contact_phone          VARCHAR(30),
  payment_terms_days     INT DEFAULT 30,          -- 30, 60, 90
  credit_limit_cents     INT DEFAULT 0,
  discount_percentage    DECIMAL(5,2) DEFAULT 0,  -- descuento adicional sobre precios tier
  is_approved            BOOLEAN DEFAULT FALSE,
  approved_at            TIMESTAMPTZ,
  approved_by            UUID REFERENCES users(id),
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

-- Direcciones de entrega
CREATE TABLE addresses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type            VARCHAR(20) DEFAULT 'delivery',  -- delivery, billing, pickup
  name            VARCHAR(100),                    -- "Casa", "Oficina", "Tienda"
  first_name      VARCHAR(100),
  last_name       VARCHAR(100),
  company         VARCHAR(200),
  address_line1   VARCHAR(300) NOT NULL,
  address_line2   VARCHAR(300),
  city            VARCHAR(100) NOT NULL,
  province        VARCHAR(100),
  postal_code     VARCHAR(10) NOT NULL,
  country         VARCHAR(2) DEFAULT 'ES',
  phone           VARCHAR(30),
  instructions    TEXT,                            -- "Timbre 2ºB, llamar al llegar"
  is_default      BOOLEAN DEFAULT FALSE,
  delivery_zone_id UUID REFERENCES delivery_zones(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_addresses_user ON addresses(user_id);
CREATE INDEX idx_addresses_default ON addresses(user_id, is_default) WHERE is_default = TRUE;

-- =============================================================================
-- PEDIDOS
-- =============================================================================

-- Pedidos principales
CREATE TABLE orders (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number          VARCHAR(30) NOT NULL UNIQUE,  -- DH-20261119-0001
  user_id               UUID NOT NULL REFERENCES users(id),
  status                order_status NOT NULL DEFAULT 'pending',
  payment_status        payment_status NOT NULL DEFAULT 'pending',
  payment_method        payment_method,
  delivery_type         delivery_type NOT NULL,
  delivery_zone_id      UUID REFERENCES delivery_zones(id),
  delivery_slot_id      UUID REFERENCES delivery_slots(id),
  delivery_address_id   UUID REFERENCES addresses(id),
  pickup_location_id    UUID,                         -- tienda/fábrica
  
  -- Fechas clave
  order_date            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at          TIMESTAMPTZ,
  preparing_at          TIMESTAMPTZ,
  ready_at              TIMESTAMPTZ,
  dispatched_at         TIMESTAMPTZ,
  delivered_at          TIMESTAMPTZ,
  completed_at          TIMESTAMPTZ,
  cancelled_at          TIMESTAMPTZ,
  
  -- Importes (en céntimos)
  subtotal_cents        INT NOT NULL DEFAULT 0,
  discount_cents        INT NOT NULL DEFAULT 0,
  delivery_fee_cents    INT NOT NULL DEFAULT 0,
  tax_cents             INT NOT NULL DEFAULT 0,
  total_cents           INT NOT NULL DEFAULT 0,
  paid_cents            INT NOT NULL DEFAULT 0,
  
  -- Facturación B2B
  invoice_number        VARCHAR(50),
  invoice_date          DATE,
  invoice_due_date      DATE,
  invoice_pdf_url       VARCHAR(500),
  
  -- Notas
  customer_notes        TEXT,                         -- notas del cliente
  internal_notes        TEXT,                         -- notas internas (cocina, repartidor)
  cancellation_reason   TEXT,
  
  -- Metadatos
  ip_address            INET,
  user_agent            TEXT,
  referrer              VARCHAR(500),
  utm_source            VARCHAR(100),
  utm_medium            VARCHAR(100),
  utm_campaign          VARCHAR(100),
  
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  deleted_at            TIMESTAMPTZ
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_delivery_slot ON orders(delivery_slot_id, delivery_type);

-- Items de pedido
CREATE TABLE order_items (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id               UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id             UUID NOT NULL REFERENCES products(id),
  product_slug           VARCHAR(150) NOT NULL,
  product_name           VARCHAR(200) NOT NULL,
  unit                   VARCHAR(50) NOT NULL,
  quantity               INT NOT NULL DEFAULT 1,
  unit_price_cents       INT NOT NULL,                -- precio unitario en céntimos (con tier B2B aplicado)
  total_price_cents      INT NOT NULL,                -- unit_price * quantity
  tax_rate               DECIMAL(5,2) DEFAULT 10.00,  -- IVA %
  tax_cents              INT NOT NULL DEFAULT 0,
  notes                  TEXT,                         -- personalizaciones: "sin azúcar", "cortado en 8"
  created_at             TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Historial de estados del pedido (auditoría)
CREATE TABLE order_status_history (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status     order_status,
  to_status       order_status NOT NULL,
  changed_by      UUID REFERENCES users(id),          -- NULL = automático
  reason          TEXT,
  metadata        JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_status_history_order ON order_status_history(order_id);

-- =============================================================================
-- PAGOS
-- =============================================================================

CREATE TABLE payments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id              UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payment_method        payment_method NOT NULL,
  provider              VARCHAR(50),                    -- stripe, bizum, manual
  provider_payment_id   VARCHAR(200),                   -- pi_xxx, bizum_xxx
  amount_cents          INT NOT NULL,
  currency              VARCHAR(3) DEFAULT 'EUR',
  status                payment_status NOT NULL DEFAULT 'pending',
  authorized_at         TIMESTAMPTZ,
  captured_at           TIMESTAMPTZ,
  refunded_at           TIMESTAMPTZ,
  refunded_amount_cents INT DEFAULT 0,
  failure_reason        TEXT,
  metadata              JSONB,                          -- respuesta completa del proveedor
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_provider_id ON payments(provider_payment_id);

-- =============================================================================
-- CARRITO PERSISTENTE
-- =============================================================================

CREATE TABLE carts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id      VARCHAR(255),                         -- para usuarios no logueados
  expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_carts_user ON carts(user_id);
CREATE INDEX idx_carts_session ON carts(session_id);
CREATE INDEX idx_carts_expires ON carts(expires_at);

CREATE TABLE cart_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id         UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id      UUID NOT NULL REFERENCES products(id),
  quantity        INT NOT NULL DEFAULT 1,
  unit_price_cents INT NOT NULL,                        -- precio en momento de añadir
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, product_id)
);

-- =============================================================================
-- FAVORITOS / WISHLIST
-- =============================================================================

CREATE TABLE favorites (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);

-- =============================================================================
-- NOTIFICACIONES / WHATSAPP
-- =============================================================================

CREATE TABLE notification_templates (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code            VARCHAR(50) NOT NULL UNIQUE,        -- order_confirmed, ready_pickup, out_for_delivery, delivered, invoice_ready
  channel         VARCHAR(20) NOT NULL DEFAULT 'whatsapp', -- whatsapp, email, sms
  subject         VARCHAR(200),
  body_template   TEXT NOT NULL,                       -- plantilla con variables {{order_number}}, {{customer_name}}, etc.
  variables       JSONB,                               -- esquema de variables esperadas
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notifications (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id            UUID REFERENCES orders(id) ON DELETE SET NULL,
  template_id         UUID REFERENCES notification_templates(id),
  channel             VARCHAR(20) NOT NULL,             -- whatsapp, email, sms, push
  recipient           VARCHAR(255) NOT NULL,            -- teléfono, email, device_token
  subject             VARCHAR(200),
  body                TEXT NOT NULL,
  status              VARCHAR(20) DEFAULT 'pending',    -- pending, sent, delivered, read, failed
  provider_message_id VARCHAR(200),
  sent_at             TIMESTAMPTZ,
  delivered_at        TIMESTAMPTZ,
  read_at             TIMESTAMPTZ,
  failed_at           TIMESTAMPTZ,
  failure_reason      TEXT,
  retry_count         INT DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_order ON notifications(order_id);
CREATE INDEX idx_notifications_status ON notifications(status);

-- =============================================================================
-- RESEÑAS
-- =============================================================================

CREATE TABLE reviews (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_id        UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating          INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title           VARCHAR(200),
  body            TEXT,
  is_verified     BOOLEAN DEFAULT FALSE,               -- compra verificada
  is_published    BOOLEAN DEFAULT TRUE,
  helpful_count   INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, order_id)
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_published ON reviews(is_published) WHERE is_published = TRUE;

-- =============================================================================
-- PEDIDOS RECURRENTES (STANDING ORDERS B2B)
-- =============================================================================

CREATE TABLE standing_orders (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name                  VARCHAR(100) NOT NULL,           -- "Pedido semanal cafetería"
  frequency             VARCHAR(20) NOT NULL,            -- weekly, biweekly, monthly
  day_of_week           INT,                             -- 0=Domingo...6=Sábado (para weekly)
  day_of_month          INT,                             -- 1-28 (para monthly)
  next_generation_date  DATE NOT NULL,
  delivery_type         delivery_type NOT NULL,
  delivery_zone_id      UUID REFERENCES delivery_zones(id),
  delivery_slot_id      UUID REFERENCES delivery_slots(id),
  delivery_address_id   UUID REFERENCES addresses(id),
  payment_method        payment_method NOT NULL DEFAULT 'invoice_net30',
  is_active             BOOLEAN DEFAULT TRUE,
  pause_until           DATE,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_standing_orders_next_gen ON standing_orders(next_generation_date) WHERE is_active = TRUE;

CREATE TABLE standing_order_items (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  standing_order_id      UUID NOT NULL REFERENCES standing_orders(id) ON DELETE CASCADE,
  product_id             UUID NOT NULL REFERENCES products(id),
  quantity               INT NOT NULL DEFAULT 1,
  unit_price_cents       INT NOT NULL,                    -- se recalcula al generar
  notes                  TEXT,
  created_at             TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- CONFIGURACIÓN Y SETTINGS
-- =============================================================================

CREATE TABLE settings (
  key          VARCHAR(100) PRIMARY KEY,
  value        JSONB NOT NULL,
  description  TEXT,
  is_public    BOOLEAN DEFAULT FALSE,              -- visible en frontend
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Settings por defecto
INSERT INTO settings (key, value, description, is_public) VALUES
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
('stripe_publishable_key', '"pk_test_..."', 'Clave pública Stripe', TRUE);

-- =============================================================================
-- VISTAS ÚTILES
-- =============================================================================

-- Vista: Productos con stock del día actual
CREATE VIEW v_products_today AS
SELECT 
  p.*,
  COALESCE(ds.available, 0) AS today_stock,
  COALESCE(ds.status, 'available') AS today_status,
  pi.url AS primary_image
FROM products p
LEFT JOIN daily_stock ds ON ds.product_id = p.id AND ds.date = CURRENT_DATE
LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = TRUE
WHERE p.is_active = TRUE;

-- Vista: Pedidos con totales calculados
CREATE VIEW v_orders_summary AS
SELECT 
  o.*,
  u.email,
  u.first_name,
  u.last_name,
  u.phone,
  COUNT(oi.id) AS items_count,
  SUM(oi.quantity) AS total_quantity
FROM orders o
JOIN users u ON u.id = o.user_id
LEFT JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, u.id;

-- Vista: Franjas con disponibilidad para una fecha
CREATE VIEW v_slots_availability AS
SELECT 
  ds.*,
  sa.orders_count,
  sa.items_count,
  sa.is_full,
  (ds.max_orders - sa.orders_count) AS remaining_orders,
  (ds.max_items - sa.items_count) AS remaining_items
FROM delivery_slots ds
LEFT JOIN slot_availability sa ON sa.slot_id = ds.id AND sa.date = CURRENT_DATE
WHERE ds.is_active = TRUE
  AND (ds.days_of_week @> ARRAY[EXTRACT(DOW FROM CURRENT_DATE)::INT])
ORDER BY ds.type, ds.start_time;

-- =============================================================================
-- FUNCIONES Y TRIGGERS
-- =============================================================================

-- Función: actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas con updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subcategories_updated_at BEFORE UPDATE ON subcategories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_b2b_profiles_updated_at BEFORE UPDATE ON b2b_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delivery_zones_updated_at BEFORE UPDATE ON delivery_zones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delivery_slots_updated_at BEFORE UPDATE ON delivery_slots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_standing_orders_updated_at BEFORE UPDATE ON standing_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: registrar cambios de estado de pedido
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_status_history (order_id, from_status, to_status, changed_by, reason)
    VALUES (NEW.id, OLD.status, NEW.status, 
      COALESCE(current_setting('app.current_user_id', TRUE)::UUID, NULL),
      COALESCE(current_setting('app.status_change_reason', TRUE), 'Status updated'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_order_status_change
  AFTER UPDATE OF status ON orders
  FOR EACH ROW EXECUTE FUNCTION log_order_status_change();

-- Trigger: generar número de pedido automático
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  prefix TEXT := 'DH-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-';
  last_num INT;
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    SELECT COALESCE(MAX(SUBSTRING(order_number FROM prefix || '(\d+)$')::INT), 0) + 1
    INTO last_num
    FROM orders
    WHERE order_number LIKE prefix || '%';
    
    NEW.order_number := prefix || LPAD(last_num::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) - OPCIONAL
-- =============================================================================

-- Habilitar RLS en tablas sensibles
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Políticas: usuarios ven solo sus datos
CREATE POLICY orders_user_policy ON orders
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY order_items_user_policy ON order_items
  FOR ALL TO authenticated
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

CREATE POLICY payments_user_policy ON payments
  FOR ALL TO authenticated
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

CREATE POLICY addresses_user_policy ON addresses
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY carts_user_policy ON carts
  FOR ALL TO authenticated
  USING (user_id = auth.uid() OR session_id = current_setting('app.session_id', TRUE));

CREATE POLICY favorites_user_policy ON favorites
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- =============================================================================
-- DATOS INICIALES (SEED)
-- =============================================================================

-- Categorías base
INSERT INTO categories (slug, name, icon, description, sort_order) VALUES
('viennoiserie', 'Viennoiserie', 'croissant', 'Croissants, pains au chocolat, brioches y masas laminadas', 1),
('tartas', 'Tartas y bizcochos', 'gift', 'Tartas de fruta, queso, bizcochos y postres de cuchara', 2),
('pan', 'Pan artesanal', 'wheat', 'Pan de masa madre, integral, rústico y especialidades', 3),
('galletas', 'Galletas', 'cookie', 'Galletas artesanales, cookies y barritas', 4),
('estacional', 'Estacional', 'sparkles', 'Productos de temporada: roscón, panettone, monas...', 5),
('bebidas', 'Bebidas', 'coffee', 'Café de especialidad, té, matcha y otras bebidas', 6);

-- Subcategorías
INSERT INTO subcategories (category_id, slug, name, sort_order) VALUES
((SELECT id FROM categories WHERE slug='viennoiserie'), 'croissants', 'Croissants', 1),
((SELECT id FROM categories WHERE slug='viennoiserie'), 'tradicionales', 'Tradicionales', 2),
((SELECT id FROM categories WHERE slug='tartas'), 'fruta', 'De fruta', 1),
((SELECT id FROM categories WHERE slug='tartas'), 'queso', 'De queso', 2),
((SELECT id FROM categories WHERE slug='tartas'), 'bizcochos', 'Bizcochos', 3),
((SELECT id FROM categories WHERE slug='pan'), 'masa-madre', 'Masa madre', 1),
((SELECT id FROM categories WHERE slug='galletas'), 'tradicionales', 'Tradicionales', 1),
((SELECT id FROM categories WHERE slug='estacional'), 'navidad', 'Navidad', 1),
((SELECT id FROM categories WHERE slug='bebidas'), 'cafe', 'Café', 1),
((SELECT id FROM categories WHERE slug='bebidas'), 'te', 'Té e infusiones', 2);

-- Alérgenos base (reglamento UE 1169/2011)
INSERT INTO allergens (code, name, severity) VALUES
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
('pescado', 'Pescado', 'high');

-- Zonas de entrega Madrid (ejemplo)
INSERT INTO delivery_zones (name, postal_codes, fee_cents, min_order_cents, estimated_time_min, sort_order) VALUES
('Centro', ARRAY['28001','28002','28003','28004','28005','28006','28007','28008','28009','28010'], 350, 1500, 30, 1),
('Norte', ARRAY['28015','28016','28017','28018','28019','28020','28021','28022','28023','28024'], 450, 2000, 40, 2),
('Sur', ARRAY['28025','28026','28027','28028','28029','28030','28031','28032','28033','28034'], 450, 2000, 40, 3),
('Este', ARRAY['28011','28012','28013','28014','28015'], 400, 1800, 35, 4),
('Oeste', ARRAY['28006','28007','28008','28009'], 400, 1800, 35, 5);

-- Franjas horarias base
INSERT INTO delivery_slots (name, type, start_time, end_time, cutoff_time, max_orders, max_items, days_of_week, sort_order) VALUES
('Recogida mañana 09:00-11:00', 'pickup', '09:00', '11:00', '10:00', 50, 200, '{1,2,3,4,5,6}', 1),
('Recogida mediodía 12:00-14:00', 'pickup', '12:00', '14:00', '11:00', 40, 150, '{1,2,3,4,5,6}', 2),
('Recogida tarde 17:00-19:00', 'pickup', '17:00', '19:00', '16:00', 30, 100, '{1,2,3,4,5}', 3),
('Delivery mañana 09:30-12:00', 'delivery', '09:30', '12:00', '10:00', 20, 80, '{1,2,3,4,5,6}', 4),
('Delivery mediodía 12:30-14:30', 'delivery', '12:30', '14:30', '11:30', 15, 60, '{1,2,3,4,5,6}', 5),
('Delivery tarde 17:30-19:30', 'delivery', '17:30', '19:30', '16:30', 15, 60, '{1,2,3,4,5}', 6);

-- Plantillas de notificación WhatsApp
INSERT INTO notification_templates (code, channel, subject, body_template, variables) VALUES
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
  '{"customer_name": "string", "invoice_number": "string", "order_number": "string", "amount": "string", "due_date": "string", "invoice_url": "string"}'::JSONB);

-- =============================================================================
-- COMENTARIOS FINALES
-- =============================================================================

-- Este schema cubre:
-- 1. Catálogo completo (productos, categorías, imágenes, alérgenos, ingredientes, nutrición)
-- 2. Precios B2B por escalones (tiers)
-- 3. Stock diario con disponibilidad real
-- 4. Zonas y franjas de entrega con capacity management
-- 5. Usuarios B2C y B2B con perfiles fiscales
-- 6. Pedidos multi-estado con auditoría completa
-- 7. Pagos multi-método (Stripe, Bizum, efectivo, factura)
-- 8. Carrito persistente + favoritos
-- 9. Pedidos recurrentes (standing orders) para Horeca
-- 10. Notificaciones WhatsApp/email con plantillas
-- 11. Reseñas con compra verificada
-- 12. RLS para seguridad multi-tenant
-- 13. Triggers para automatización (números de pedido, timestamps, logs)
-- 14. Vistas optimizadas para queries frecuentes
-- 15. Settings configurables sin deploy