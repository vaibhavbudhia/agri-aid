-- Identifies what kind of service a provider offers.
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_type VARCHAR(20);

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_provider_type_check;
ALTER TABLE users ADD CONSTRAINT users_provider_type_check
  CHECK (provider_type IS NULL OR provider_type IN ('farmer', 'mechanic'));
