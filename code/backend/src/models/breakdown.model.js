// Real query functions for breakdown_reports.
// Owner: Neha Bansal

const db = require('../config/db');

async function create({ farmerId, equipmentType, description, latitude, longitude, requiredTime }) {
  const { rows } = await db.query(
    `INSERT INTO breakdown_reports (farmer_id, equipment_type, description, latitude, longitude, required_time)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [farmerId, equipmentType, description || null, latitude || null, longitude || null, requiredTime || null]
  );
  return rows[0];
}

async function findById(id) {
  const { rows } = await db.query('SELECT * FROM breakdown_reports WHERE id = $1', [id]);
  return rows[0] || null;
}

// "Nearby mechanics" = resource providers who list a 'service' type
// resource, ranked by straight-line distance from the report's coordinates
// when both sides have a location on file. Providers with no location, or
// reports with no location, still show up (just unranked / last).
async function findNearbyMechanics(latitude, longitude) {
  const { rows } = await db.query(
    `SELECT DISTINCT ON (u.id) u.id, u.name, u.phone, u.region, r.latitude, r.longitude,
        rep.avg_rating, rep.total_ratings, rep.jobs_completed
     FROM resources r
     JOIN users u ON u.id = r.provider_id
     LEFT JOIN (
       SELECT assigned_provider_id,
              ROUND(AVG(rating)::numeric, 1) AS avg_rating,
              COUNT(rating) AS total_ratings,
              COUNT(*) FILTER (WHERE status = 'resolved') AS jobs_completed
       FROM breakdown_reports
       WHERE assigned_provider_id IS NOT NULL
       GROUP BY assigned_provider_id
     ) rep ON rep.assigned_provider_id = u.id
     WHERE r.type = 'service'`
  );

  if (latitude == null || longitude == null) return rows;

  return rows
    .map((m) => ({ ...m, distance_km: distanceKm(latitude, longitude, m.latitude, m.longitude) }))
    .sort((a, b) => (a.distance_km ?? Infinity) - (b.distance_km ?? Infinity));
}

function distanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

async function listForFarmer(farmerId) {
  const { rows } = await db.query(
    `SELECT b.*, u.name AS mechanic_name, u.phone AS mechanic_phone
     FROM breakdown_reports b
     LEFT JOIN users u ON u.id = b.assigned_provider_id
     WHERE b.farmer_id = $1 ORDER BY b.created_at DESC`,
    [farmerId]
  );
  return rows;
}

// Reports a service provider can act on: open ones (unclaimed) plus any
// already assigned to them.
async function listForProvider(providerId) {
  const { rows } = await db.query(
    `SELECT b.*, u.name AS farmer_name, u.phone AS farmer_phone
     FROM breakdown_reports b
     JOIN users u ON u.id = b.farmer_id
     WHERE b.status = 'open' OR b.assigned_provider_id = $1
     ORDER BY b.created_at DESC`,
    [providerId]
  );
  return rows;
}

async function accept(id, providerId) {
  const { rows } = await db.query(
    `UPDATE breakdown_reports SET assigned_provider_id = $2, status = 'accepted'
     WHERE id = $1 AND status = 'open'
     RETURNING *`,
    [id, providerId]
  );
  return rows[0] || null;
}

// A provider declining a request they were assigned releases it back to
// the open pool for other mechanics to pick up.
async function reject(id, providerId) {
  const { rows } = await db.query(
    `UPDATE breakdown_reports SET assigned_provider_id = NULL, status = 'open'
     WHERE id = $1 AND assigned_provider_id = $2
     RETURNING *`,
    [id, providerId]
  );
  return rows[0] || null;
}

async function updateStatus(id, providerId, status) {
  const { rows } = await db.query(
    `UPDATE breakdown_reports SET status = $3
     WHERE id = $1 AND assigned_provider_id = $2
     RETURNING *`,
    [id, providerId, status]
  );
  return rows[0] || null;
}

async function rate(id, farmerId, rating, comment) {
  const { rows } = await db.query(
    `UPDATE breakdown_reports SET rating = $3, rating_comment = $4
     WHERE id = $1 AND farmer_id = $2 AND status = 'resolved'
     RETURNING *`,
    [id, farmerId, rating, comment || null]
  );
  return rows[0] || null;
}

module.exports = {
  create,
  findById,
  findNearbyMechanics,
  listForFarmer,
  listForProvider,
  accept,
  reject,
  updateStatus,
  rate,
};
