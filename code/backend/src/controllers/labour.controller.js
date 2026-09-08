// Local labour request + matching logic. Not implemented — Phase 4.

async function createLabourRequest(req, res) {
  // TODO: insert labour_requests row
  res.status(501).json({ error: 'not implemented' });
}

async function matchNearbyWorkers(req, res) {
  // TODO: return labour requests within a radius of the worker's location
  res.status(501).json({ error: 'not implemented' });
}

module.exports = { createLabourRequest, matchNearbyWorkers };
