const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { createBooking, updateBookingStatus, listMyBookings } = require('../controllers/bookings.controller');

router.get('/', requireAuth, listMyBookings);
router.post('/', requireAuth, createBooking);
router.patch('/:id', requireAuth, updateBookingStatus);

module.exports = router;
