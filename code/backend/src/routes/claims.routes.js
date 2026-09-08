const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { createClaim, uploadClaimDocument } = require('../controllers/claims.controller');

router.post('/', requireAuth, createClaim);
router.post('/:id/documents', requireAuth, uploadClaimDocument);

module.exports = router;
