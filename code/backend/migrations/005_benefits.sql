-- 005_benefits.sql
-- Owner: Neha Bansal

CREATE TABLE IF NOT EXISTS schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  eligibility_rules JSONB NOT NULL,
  required_documents TEXT[],
  created_by UUID REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS scheme_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scheme_id UUID NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'eligible' CHECK (status IN ('eligible','applied','under_review','approved','rejected'))
);

CREATE TABLE IF NOT EXISTS insurance_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  crop VARCHAR(50) NOT NULL,
  incident_date DATE NOT NULL,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  damage_description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','documents_pending','under_review'))
);

CREATE TABLE IF NOT EXISTS claim_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID NOT NULL REFERENCES insurance_claims(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMP NOT NULL DEFAULT now()
);
