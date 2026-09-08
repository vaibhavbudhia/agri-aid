// Minimal smoke test — checks the app module loads and health route exists.
// Owner: Vaibhav Budhia

const test = require('node:test');
const assert = require('node:assert');

test('auth controller exports register and login', () => {
  const authController = require('../src/controllers/auth.controller');
  assert.strictEqual(typeof authController.register, 'function');
  assert.strictEqual(typeof authController.login, 'function');
});

test('auth middleware exports requireAuth', () => {
  const { requireAuth } = require('../src/middleware/auth.middleware');
  assert.strictEqual(typeof requireAuth, 'function');
});
