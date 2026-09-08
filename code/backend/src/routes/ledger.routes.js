const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { addLedgerEntry, getLedgerSummary } = require('../controllers/ledger.controller');

router.post('/', requireAuth, addLedgerEntry);
router.get('/', requireAuth, getLedgerSummary);

module.exports = router;
