const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { getEligibleSchemes } = require('../controllers/schemes.controller');

router.get('/eligible', requireAuth, getEligibleSchemes);

module.exports = router;
