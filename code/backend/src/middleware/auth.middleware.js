// Verifies the JWT in the Authorization header, attaches decoded payload to req.user.
// Owner: Vaibhav Budhia

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'missing or malformed Authorization header' } });
  }

  const token = header.slice('Bearer '.length);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'invalid or expired token' } });
  }
}

module.exports = { requireAuth };
