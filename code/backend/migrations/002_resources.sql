-- 002_resources.sql
-- Owner: Neha Bansal

CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('tractor','harvester','pump','rotavator','trailer','service')),
  description TEXT,
  usage_charge DECIMAL(8,2) NOT NULL,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resource_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL
);
