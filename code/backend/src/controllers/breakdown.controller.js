// Real equipment breakdown reporting + nearby mechanic matching +
// accept/reject/status workflow + service ratings.
// Owner: Lovish Bansal

const breakdownModel = require('../models/breakdown.model');

async function reportBreakdown(req, res) {
  if (req.user.role !== 'farmer') {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'only farmer accounts can report breakdowns' } });
  }

  const { equipment_type, description, latitude, longitude, required_time } = req.body;

  if (!equipment_type) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'equipment_type is required' } });
  }

  const report = await breakdownModel.create({
    farmerId: req.user.id,
    equipmentType: equipment_type,
    description,
    latitude,
    longitude,
    requiredTime: required_time,
  });

  const mechanics = await breakdownModel.findNearbyMechanics(latitude, longitude);
  res.status(201).json({ report, nearby_mechanics: mechanics });
}

async function listMyBreakdowns(req, res) {
  const reports = await breakdownModel.listForFarmer(req.user.id);
  res.json({ results: reports });
}

async function listForProvider(req, res) {
  if (req.user.role !== 'provider') {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'only provider accounts see the repair request queue' } });
  }
  const reports = await breakdownModel.listForProvider(req.user.id);
  res.json({ results: reports });
}

async function acceptRequest(req, res) {
  if (req.user.role !== 'provider') {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'only provider accounts can accept repair requests' } });
  }
  const updated = await breakdownModel.accept(req.params.id, req.user.id);
  if (!updated) {
    return res.status(409).json({ error: { code: 'ALREADY_CLAIMED', message: 'this request is no longer open' } });
  }
  res.json(updated);
}

async function rejectRequest(req, res) {
  if (req.user.role !== 'provider') {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'only provider accounts can reject repair requests' } });
  }
  const updated = await breakdownModel.reject(req.params.id, req.user.id);
  if (!updated) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'request not found or not assigned to you' } });
  }
  res.json(updated);
}

async function updateStatus(req, res) {
  if (req.user.role !== 'provider') {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'only the assigned provider can update status' } });
  }
  const { status } = req.body;
  if (!['in_progress', 'resolved'].includes(status)) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'status must be in_progress or resolved' } });
  }
  const updated = await breakdownModel.updateStatus(req.params.id, req.user.id, status);
  if (!updated) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'request not found or not assigned to you' } });
  }
  res.json(updated);
}

async function rateService(req, res) {
  const { rating, comment } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'rating must be between 1 and 5' } });
  }
  const updated = await breakdownModel.rate(req.params.id, req.user.id, rating, comment);
  if (!updated) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'resolved request not found for this farmer' } });
  }
  res.json(updated);
}

module.exports = {
  reportBreakdown,
  listMyBreakdowns,
  listForProvider,
  acceptRequest,
  rejectRequest,
  updateStatus,
  rateService,
};
