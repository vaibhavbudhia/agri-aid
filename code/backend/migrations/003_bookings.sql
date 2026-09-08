-- 003_bookings.sql
-- Owner: Neha Bansal

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','completed')),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  is_group_booking BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS booking_group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS breakdown_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  equipment_type VARCHAR(50) NOT NULL,
  description TEXT,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open','assigned','resolved')),
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
