const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { getProfile } = require('../controllers/profile.controller');

router.get('/', requireAuth, getProfile);

module.exports = router;
