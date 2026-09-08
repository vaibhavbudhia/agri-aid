-- 004_operations.sql
-- Owner: Neha Bansal

CREATE TABLE IF NOT EXISTS labour_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  work_type VARCHAR(50) NOT NULL,
  workers_needed INTEGER NOT NULL,
  work_date DATE NOT NULL,
  duration_days INTEGER NOT NULL,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open','matched','completed'))
);

CREATE TABLE IF NOT EXISTS ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entry_type VARCHAR(10) NOT NULL CHECK (entry_type IN ('expense','revenue')),
  category VARCHAR(20) NOT NULL CHECK (category IN ('seeds','fertilizer','labour','fuel','machinery','transport','produce_sale')),
  amount DECIMAL(10,2) NOT NULL,
  crop_cycle VARCHAR(50),
  entry_date DATE NOT NULL
);
