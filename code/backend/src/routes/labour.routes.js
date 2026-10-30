const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { createLabourRequest, matchNearbyWorkers, listMyRequests, apply, listApplications, decideApplication } = require('../controllers/labour.controller');

router.post('/', requireAuth, createLabourRequest);
router.get('/nearby', requireAuth, matchNearbyWorkers);
router.get('/mine', requireAuth, listMyRequests);
router.post('/:id/applications', requireAuth, apply);
router.get('/:id/applications', requireAuth, listApplications);
router.patch('/applications/:applicationId', requireAuth, decideApplication);

module.exports = router;
