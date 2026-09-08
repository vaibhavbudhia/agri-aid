// Real query functions for bookings, including overlap conflict detection.
// Owner: Neha Bansal / Lovish Bansal

const db = require('../config/db');

// Returns true if [startTime, endTime) overlaps any ACCEPTED booking
// on this resource. Pending bookings from other farmers don't block —
// only confirmed ones do, since pending is just a request.
async function hasConflict(resourceId, startTime, endTime) {
  const { rows } = await db.query(
    `SELECT id FROM bookings
     WHERE resource_id = $1
       AND status = 'accepted'
       AND start_time < $3
       AND end_time > $2`,
    [resourceId, startTime, endTime]
  );
  return rows.length > 0;
}

async function create({ resourceId, farmerId, startTime, endTime, isGroupBooking, groupMemberIds }) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // Re-check conflict inside the transaction to avoid a race between
    // two farmers booking the same slot at the same instant.
    const conflictCheck = await client.query(
      `SELECT id FROM bookings
       WHERE resource_id = $1 AND status = 'accepted'
         AND start_time < $3 AND end_time > $2
       FOR UPDATE`,
      [resourceId, startTime, endTime]
    );
    if (conflictCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return { conflict: true };
    }

    const { rows } = await client.query(
      `INSERT INTO bookings (resource_id, farmer_id, start_time, end_time, is_group_booking)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [resourceId, farmerId, startTime, endTime, !!isGroupBooking]
    );
    const booking = rows[0];

    if (isGroupBooking && Array.isArray(groupMemberIds)) {
      for (const memberId of groupMemberIds) {
        await client.query(
          `INSERT INTO booking_group_members (booking_id, farmer_id) VALUES ($1, $2)`,
          [booking.id, memberId]
        );
      }
    }

    await client.query('COMMIT');
    return { conflict: false, booking };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function findById(id) {
  const { rows } = await db.query('SELECT * FROM bookings WHERE id = $1', [id]);
  return rows[0] || null;
}

async function updateStatus(id, status) {
  const { rows } = await db.query(
    `UPDATE bookings SET status = $2 WHERE id = $1 RETURNING *`,
    [id, status]
  );
  return rows[0] || null;
}

async function listGroupMembers(bookingId) {
  const { rows } = await db.query(
    `SELECT u.id, u.name FROM booking_group_members m
     JOIN users u ON u.id = m.farmer_id WHERE m.booking_id = $1`,
    [bookingId]
  );
  return rows;
}

async function listForProvider(providerId) {
  const { rows } = await db.query(
    `SELECT b.*, r.type AS resource_type, r.usage_charge, u.name AS farmer_name, u.phone AS farmer_phone
     FROM bookings b
     JOIN resources r ON r.id = b.resource_id
     JOIN users u ON u.id = b.farmer_id
     WHERE r.provider_id = $1
     ORDER BY b.created_at DESC`,
    [providerId]
  );
  return rows;
}

async function listForFarmer(farmerId) {
  const { rows } = await db.query(
    `SELECT b.*, r.type AS resource_type, r.usage_charge, u.name AS provider_name
     FROM bookings b
     JOIN resources r ON r.id = b.resource_id
     JOIN users u ON u.id = r.provider_id
     WHERE b.farmer_id = $1
     ORDER BY b.created_at DESC`,
    [farmerId]
  );
  return rows;
}

module.exports = { hasConflict, create, findById, updateStatus, listGroupMembers, listForProvider, listForFarmer };
