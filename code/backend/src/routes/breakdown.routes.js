const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const {
  reportBreakdown,
  listMyBreakdowns,
  listForProvider,
  acceptRequest,
  rejectRequest,
  updateStatus,
  rateService,
} = require('../controllers/breakdown.controller');

router.get('/', requireAuth, listMyBreakdowns);
router.get('/provider', requireAuth, listForProvider);
router.post('/', requireAuth, reportBreakdown);
router.patch('/:id/accept', requireAuth, acceptRequest);
router.patch('/:id/reject', requireAuth, rejectRequest);
router.patch('/:id/status', requireAuth, updateStatus);
router.post('/:id/rate', requireAuth, rateService);

module.exports = router;
