const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const {
  listResources,
  createResource,
  addAvailability,
  listAvailability,
} = require('../controllers/resources.controller');

router.get('/', listResources);
router.post('/', requireAuth, createResource);
router.get('/:id/availability', listAvailability);
router.post('/:id/availability', requireAuth, addAvailability);

module.exports = router;
