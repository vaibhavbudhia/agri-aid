// Real query functions backing the users table.
// Owner: Neha Bansal / Lovish Bansal

const db = require('../config/db');

async function findByPhone(phone) {
  const { rows } = await db.query('SELECT * FROM users WHERE phone = $1', [phone]);
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await db.query('SELECT id, name, phone, email, role, provider_type, region, created_at FROM users WHERE id = $1', [id]);
  return rows[0] || null;
}

async function create({ name, phone, email, passwordHash, role, providerType, region }) {
  const { rows } = await db.query(
    `INSERT INTO users (name, phone, email, password_hash, role, provider_type, region)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, phone, role, provider_type, region, created_at`,
    [name, phone, email || null, passwordHash, role, providerType || null, region || null]
  );
  return rows[0];
}

module.exports = { findByPhone, findById, create };
