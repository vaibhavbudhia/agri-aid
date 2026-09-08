// Owner: Vaibhav Budhia

const test = require('node:test');
const assert = require('node:assert');

test('resources controller exports listResources and createResource', () => {
  const controller = require('../src/controllers/resources.controller');
  assert.strictEqual(typeof controller.listResources, 'function');
  assert.strictEqual(typeof controller.createResource, 'function');
});

test('bookings controller exports createBooking, updateBookingStatus, listMyBookings', () => {
  const controller = require('../src/controllers/bookings.controller');
  assert.strictEqual(typeof controller.createBooking, 'function');
  assert.strictEqual(typeof controller.updateBookingStatus, 'function');
  assert.strictEqual(typeof controller.listMyBookings, 'function');
});

test('breakdown controller exports reportBreakdown and listMyBreakdowns', () => {
  const controller = require('../src/controllers/breakdown.controller');
  assert.strictEqual(typeof controller.reportBreakdown, 'function');
  assert.strictEqual(typeof controller.listMyBreakdowns, 'function');
});

test('booking model exports hasConflict for overlap detection', () => {
  const model = require('../src/models/booking.model');
  assert.strictEqual(typeof model.hasConflict, 'function');
  assert.strictEqual(typeof model.create, 'function');
});
