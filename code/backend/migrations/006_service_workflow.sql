-- 006_service_workflow.sql
-- Adds: required-by time on breakdown reports, provider accept/reject/status
-- workflow, and a basic rating/reputation trail for mechanics.

ALTER TABLE breakdown_reports
  ADD COLUMN IF NOT EXISTS required_time TIMESTAMP,
  ADD COLUMN IF NOT EXISTS assigned_provider_id UUID REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS rating_comment TEXT;

ALTER TABLE breakdown_reports DROP CONSTRAINT IF EXISTS breakdown_reports_status_check;
ALTER TABLE breakdown_reports
  ADD CONSTRAINT breakdown_reports_status_check
  CHECK (status IN ('open', 'accepted', 'rejected', 'in_progress', 'resolved'));
