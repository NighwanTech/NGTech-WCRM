-- 076_ai_knowledge_vector_products.sql

-- 1. Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create ai_knowledge_chunks table for embeddings
CREATE TABLE IF NOT EXISTS ai_knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  document_id UUID REFERENCES ai_knowledge_documents(id) ON DELETE CASCADE,
  source_type VARCHAR(50) DEFAULT 'document', -- 'document', 'website', 'text'
  source_url TEXT,
  content TEXT NOT NULL,
  embedding vector(768), -- Google text-embedding-004 uses 768 dimensions by default. OpenAI uses 1536. We'll use 768 for gemini fallback.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_knowledge_chunks_account 
  ON ai_knowledge_chunks(account_id);

-- 3. Create match_knowledge_chunks RPC
CREATE OR REPLACE FUNCTION match_knowledge_chunks (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  p_account_id UUID
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  source_type VARCHAR(50),
  source_url TEXT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ai_knowledge_chunks.id,
    ai_knowledge_chunks.content,
    ai_knowledge_chunks.source_type,
    ai_knowledge_chunks.source_url,
    1 - (ai_knowledge_chunks.embedding <=> query_embedding) AS similarity
  FROM ai_knowledge_chunks
  WHERE ai_knowledge_chunks.account_id = p_account_id
    AND 1 - (ai_knowledge_chunks.embedding <=> query_embedding) > match_threshold
  ORDER BY ai_knowledge_chunks.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- RLS for ai_knowledge_chunks
ALTER TABLE ai_knowledge_chunks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ai_knowledge_chunks_select ON ai_knowledge_chunks;
CREATE POLICY ai_knowledge_chunks_select ON ai_knowledge_chunks FOR SELECT USING (is_account_member(account_id));

DROP POLICY IF EXISTS ai_knowledge_chunks_insert ON ai_knowledge_chunks;
CREATE POLICY ai_knowledge_chunks_insert ON ai_knowledge_chunks FOR INSERT WITH CHECK (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS ai_knowledge_chunks_delete ON ai_knowledge_chunks;
CREATE POLICY ai_knowledge_chunks_delete ON ai_knowledge_chunks FOR DELETE USING (is_account_member(account_id, 'admin'));

-- 4. Create products table (for both products and services)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC,
  currency VARCHAR(10) DEFAULT 'USD',
  type VARCHAR(50) DEFAULT 'product', -- 'product', 'service'
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  sync_id TEXT, -- ID from Meta Commerce Catalog if synced
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_account ON products(account_id);

-- Add updated_at trigger
DROP TRIGGER IF EXISTS set_products_updated_at ON products;
CREATE TRIGGER set_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- RLS for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS products_select ON products;
CREATE POLICY products_select ON products FOR SELECT USING (is_account_member(account_id));

DROP POLICY IF EXISTS products_insert ON products;
CREATE POLICY products_insert ON products FOR INSERT WITH CHECK (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS products_update ON products;
CREATE POLICY products_update ON products FOR UPDATE USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS products_delete ON products;
CREATE POLICY products_delete ON products FOR DELETE USING (is_account_member(account_id, 'admin'));
