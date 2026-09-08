// Real profile lookup, protected by requireAuth.
// Owner: Lovish Bansal

const userModel = require('../models/user.model');

async function getProfile(req, res) {
  const user = await userModel.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'user not found' } });
  }
  res.json(user);
}

module.exports = { getProfile };
