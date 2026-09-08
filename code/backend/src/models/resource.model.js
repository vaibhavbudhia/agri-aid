// Real query functions for the resources table.
// Owner: Neha Bansal / Lovish Bansal

const db = require('../config/db');

async function create({ providerId, type, description, usageCharge, latitude, longitude }) {
  const { rows } = await db.query(
    `INSERT INTO resources (provider_id, type, description, usage_charge, latitude, longitude)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [providerId, type, description || null, usageCharge, latitude || null, longitude || null]
  );
  return rows[0];
}

async function list({ type, providerId, availableFrom, availableTo } = {}) {
  const conditions = [];
  const params = [];

  if (type) {
    params.push(type);
    conditions.push(`type = $${params.length}`);
  }
  if (providerId) {
    params.push(providerId);
    conditions.push(`provider_id = $${params.length}`);
  }
  if (availableFrom && availableTo) {
    params.push(availableFrom, availableTo);
    conditions.push(
      `EXISTS (
        SELECT 1 FROM resource_availability a
        WHERE a.resource_id = r.id
          AND a.start_time <= $${params.length - 1}
          AND a.end_time >= $${params.length}
      )`
    );
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await db.query(
    `SELECT r.*, u.name AS provider_name, u.region AS provider_region,
        (SELECT COUNT(*) FROM bookings b WHERE b.resource_id = r.id AND b.status = 'completed') AS times_booked
     FROM resources r
     JOIN users u ON u.id = r.provider_id
     ${where}
     ORDER BY r.created_at DESC`,
    params
  );
  return rows;
}

async function findById(id) {
  const { rows } = await db.query(
    `SELECT r.*, u.name AS provider_name, u.region AS provider_region
     FROM resources r JOIN users u ON u.id = r.provider_id WHERE r.id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function addAvailability(resourceId, startTime, endTime) {
  const { rows } = await db.query(
    `INSERT INTO resource_availability (resource_id, start_time, end_time)
     VALUES ($1, $2, $3) RETURNING *`,
    [resourceId, startTime, endTime]
  );
  return rows[0];
}

async function listAvailability(resourceId) {
  const { rows } = await db.query(
    `SELECT * FROM resource_availability WHERE resource_id = $1 ORDER BY start_time ASC`,
    [resourceId]
  );
  return rows;
}

// True if [startTime, endTime] sits fully inside a single declared window,
// or if the provider hasn't declared any windows yet (open availability).
async function isWithinDeclaredAvailability(resourceId, startTime, endTime) {
  const { rows: windows } = await db.query(
    `SELECT id FROM resource_availability WHERE resource_id = $1`,
    [resourceId]
  );
  if (windows.length === 0) return true;

  const { rows } = await db.query(
    `SELECT id FROM resource_availability
     WHERE resource_id = $1 AND start_time <= $2 AND end_time >= $3`,
    [resourceId, startTime, endTime]
  );
  return rows.length > 0;
}

module.exports = {
  create,
  list,
  findById,
  addAvailability,
  listAvailability,
  isWithinDeclaredAvailability,
};
