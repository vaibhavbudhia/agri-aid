-- Farm Operations & Financial Management: Phase 4 completion.
ALTER TABLE labour_requests ADD COLUMN IF NOT EXISTS location_name VARCHAR(120);
ALTER TABLE labour_requests ADD COLUMN IF NOT EXISTS budget_per_worker DECIMAL(10,2);
ALTER TABLE labour_requests ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE labour_requests ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT now();
ALTER TABLE ledger_entries ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE ledger_entries ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT now();
CREATE TABLE IF NOT EXISTS labour_applications (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), request_id UUID NOT NULL REFERENCES labour_requests(id) ON DELETE CASCADE, worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, message VARCHAR(500), status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected')), created_at TIMESTAMP NOT NULL DEFAULT now(), UNIQUE (request_id, worker_id));
CREATE INDEX IF NOT EXISTS labour_requests_open_date_idx ON labour_requests (status, work_date);
CREATE INDEX IF NOT EXISTS labour_requests_farmer_idx ON labour_requests (farmer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS ledger_entries_farmer_date_idx ON ledger_entries (farmer_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS labour_applications_request_idx ON labour_applications (request_id, status);
