const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { manageSchemes } = require('../controllers/admin.controller');

router.use(requireAuth); // TODO: also check req.user.role === 'admin'
router.get('/schemes', manageSchemes);

module.exports = router;
