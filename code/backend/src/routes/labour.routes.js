const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { createLabourRequest, matchNearbyWorkers } = require('../controllers/labour.controller');

router.post('/', requireAuth, createLabourRequest);
router.get('/nearby', matchNearbyWorkers);

module.exports = router;
