// Real booking creation + accept/reject logic.
// Owner: Lovish Bansal

const bookingModel = require('../models/booking.model');
const resourceModel = require('../models/resource.model');

async function createBooking(req, res) {
  const { resource_id, start_time, end_time, is_group_booking, group_member_ids } = req.body;

  // Only farmer accounts book resources -- a provider that also wants to
  // borrow equipment needs a farmer account, kept separate from their
  // provider identity.
  if (req.user.role !== 'farmer') {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'only farmer accounts can book resources -- register or switch to a farmer account' } });
  }

  if (!resource_id || !start_time || !end_time) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'resource_id, start_time, and end_time are required' } });
  }
  if (new Date(start_time) >= new Date(end_time)) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'start_time must be before end_time' } });
  }

  const resource = await resourceModel.findById(resource_id);
  if (!resource) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'resource not found' } });
  }

  const withinAvailability = await resourceModel.isWithinDeclaredAvailability(resource_id, start_time, end_time);
  if (!withinAvailability) {
    return res.status(409).json({ error: { code: 'OUTSIDE_AVAILABILITY', message: 'the provider has not made this resource available for the requested window' } });
  }

  const result = await bookingModel.create({
    resourceId: resource_id,
    farmerId: req.user.id,
    startTime: start_time,
    endTime: end_time,
    isGroupBooking: is_group_booking,
    groupMemberIds: group_member_ids,
  });

  if (result.conflict) {
    return res.status(409).json({ error: { code: 'BOOKING_CONFLICT', message: 'resource is already booked for an overlapping time window' } });
  }

  res.status(201).json(result.booking);
}

async function updateBookingStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!['accepted', 'rejected', 'completed'].includes(status)) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'status must be accepted, rejected, or completed' } });
  }

  const booking = await bookingModel.findById(id);
  if (!booking) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'booking not found' } });
  }

  const resource = await resourceModel.findById(booking.resource_id);
  if (!resource || resource.provider_id !== req.user.id) {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'only the resource provider can update this booking' } });
  }

  // If accepting, re-check for conflicts against OTHER accepted bookings
  // (in case two pending requests overlapped and both are being accepted).
  if (status === 'accepted') {
    const conflict = await bookingModel.hasConflict(booking.resource_id, booking.start_time, booking.end_time);
    if (conflict) {
      return res.status(409).json({ error: { code: 'BOOKING_CONFLICT', message: 'another accepted booking already overlaps this window' } });
    }
  }

  const updated = await bookingModel.updateStatus(id, status);
  res.json(updated);
}

async function listMyBookings(req, res) {
  const bookings = req.user.role === 'provider'
    ? await bookingModel.listForProvider(req.user.id)
    : await bookingModel.listForFarmer(req.user.id);

  const withMembers = await Promise.all(bookings.map(async (b) => {
    if (!b.is_group_booking) return b;
    const group_members = await bookingModel.listGroupMembers(b.id);
    return { ...b, group_members };
  }));

  res.json({ results: withMembers });
}

module.exports = { createBooking, updateBookingStatus, listMyBookings };
