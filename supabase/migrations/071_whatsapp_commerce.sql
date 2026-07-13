-- ============================================================
-- 071_whatsapp_commerce.sql
-- WhatsApp Catalog and Commerce Integration
-- ============================================================

-- 1. Add Meta Catalog ID and App Secret to whatsapp_config
ALTER TABLE whatsapp_config
  ADD COLUMN IF NOT EXISTS catalog_id TEXT,
  ADD COLUMN IF NOT EXISTS app_secret TEXT;

-- 2. Update messages.content_type to allow 'order'
ALTER TABLE messages
  DROP CONSTRAINT IF EXISTS messages_content_type_check;

ALTER TABLE messages
  ADD CONSTRAINT messages_content_type_check
  CHECK (content_type IN (
    'text', 'image', 'document', 'audio', 'video',
    'location', 'template', 'interactive', 'order'
  ));

-- 3. Create whatsapp_orders table
CREATE TABLE IF NOT EXISTS whatsapp_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  catalog_id TEXT,
  total_price NUMERIC,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_orders_account ON whatsapp_orders(account_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_orders_contact ON whatsapp_orders(contact_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_orders_conversation ON whatsapp_orders(conversation_id);

ALTER TABLE whatsapp_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS whatsapp_orders_select ON whatsapp_orders;
CREATE POLICY whatsapp_orders_select ON whatsapp_orders FOR SELECT USING (is_account_member(account_id));

DROP POLICY IF EXISTS whatsapp_orders_insert ON whatsapp_orders;
CREATE POLICY whatsapp_orders_insert ON whatsapp_orders FOR INSERT WITH CHECK (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS whatsapp_orders_update ON whatsapp_orders;
CREATE POLICY whatsapp_orders_update ON whatsapp_orders FOR UPDATE USING (is_account_member(account_id));

DROP POLICY IF EXISTS whatsapp_orders_delete ON whatsapp_orders;
CREATE POLICY whatsapp_orders_delete ON whatsapp_orders FOR DELETE USING (is_account_member(account_id, 'admin'));

-- 4. Create whatsapp_order_items table
CREATE TABLE IF NOT EXISTS whatsapp_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES whatsapp_orders(id) ON DELETE CASCADE,
  product_retailer_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  item_price NUMERIC,
  currency TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_order_items_order ON whatsapp_order_items(order_id);

ALTER TABLE whatsapp_order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS whatsapp_order_items_select ON whatsapp_order_items;
CREATE POLICY whatsapp_order_items_select ON whatsapp_order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM whatsapp_orders WHERE whatsapp_orders.id = whatsapp_order_items.order_id AND is_account_member(whatsapp_orders.account_id))
);

-- Note: No insert/update/delete policies needed for non-service roles, as webhooks (Service Role) will populate this.

-- 5. Create tenant_webhooks table for outbound ERP sync
CREATE TABLE IF NOT EXISTS tenant_webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  secret TEXT,
  events TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenant_webhooks_account ON tenant_webhooks(account_id);

ALTER TABLE tenant_webhooks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_webhooks_select ON tenant_webhooks;
CREATE POLICY tenant_webhooks_select ON tenant_webhooks FOR SELECT USING (is_account_member(account_id));

DROP POLICY IF EXISTS tenant_webhooks_insert ON tenant_webhooks;
CREATE POLICY tenant_webhooks_insert ON tenant_webhooks FOR INSERT WITH CHECK (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS tenant_webhooks_update ON tenant_webhooks;
CREATE POLICY tenant_webhooks_update ON tenant_webhooks FOR UPDATE USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS tenant_webhooks_delete ON tenant_webhooks;
CREATE POLICY tenant_webhooks_delete ON tenant_webhooks FOR DELETE USING (is_account_member(account_id, 'admin'));

-- 6. Add updated_at triggers
DROP TRIGGER IF EXISTS set_updated_at ON whatsapp_orders;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON whatsapp_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at ON tenant_webhooks;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON tenant_webhooks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
