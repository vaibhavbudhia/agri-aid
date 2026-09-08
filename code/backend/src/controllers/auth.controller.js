// Real registration/login logic: bcrypt hashing + JWT issuing.
// Owner: Lovish Bansal

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRY = '7d';

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

async function register(req, res) {
  const { name, phone, password, role, providerType, region, email } = req.body;

  if (!name || !phone || !password || !role) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'name, phone, password, and role are required' } });
  }
  if (!['farmer', 'provider', 'admin'].includes(role)) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'role must be farmer, provider, or admin' } });
  }
  if (role === 'provider' && !['farmer', 'mechanic'].includes(providerType)) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'providerType must be farmer or mechanic for providers' } });
  }

  const existing = await userModel.findByPhone(phone);
  if (existing) {
    return res.status(409).json({ error: { code: 'PHONE_TAKEN', message: 'phone is already registered' } });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userModel.create({ name, phone, email, passwordHash, role, providerType: role === 'provider' ? providerType : null, region });
  const token = signToken(user);

  res.status(201).json({ id: user.id, name: user.name, role: user.role, providerType: user.provider_type, token });
}

async function login(req, res) {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'phone and password are required' } });
  }

  const user = await userModel.findByPhone(phone);
  if (!user) {
    return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'invalid phone or password' } });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'invalid phone or password' } });
  }

  const token = signToken(user);
  res.json({ token, role: user.role });
}

module.exports = { register, login };
