// Real resource listing/discovery logic.
// Owner: Lovish Bansal

const resourceModel = require('../models/resource.model');

const VALID_TYPES = ['tractor', 'harvester', 'pump', 'rotavator', 'trailer', 'service'];

async function listResources(req, res) {
  const { type, available_from, available_to, provider_id } = req.query;
  if (type && !VALID_TYPES.includes(type)) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: `type must be one of ${VALID_TYPES.join(', ')}` } });
  }
  const resources = await resourceModel.list({
    type,
    providerId: provider_id,
    availableFrom: available_from,
    availableTo: available_to,
  });
  res.json({ results: resources });
}

async function createResource(req, res) {
  const { type, description, usage_charge, latitude, longitude } = req.body;

  if (!type || !usage_charge) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'type and usage_charge are required' } });
  }
  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: `type must be one of ${VALID_TYPES.join(', ')}` } });
  }
  // Only provider accounts can list resources. A farmer who wants to list
  // equipment needs a separate provider account -- the two roles are kept
  // distinct so "who's asking" and "who's offering" are never ambiguous.
  if (req.user.role !== 'provider') {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'only provider accounts can list resources -- register or switch to a provider account' } });
  }

  const resource = await resourceModel.create({
    providerId: req.user.id,
    type,
    description,
    usageCharge: usage_charge,
    latitude,
    longitude,
  });
  res.status(201).json(resource);
}

async function addAvailability(req, res) {
  const { id } = req.params;
  const { start_time, end_time } = req.body;

  if (!start_time || !end_time) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'start_time and end_time are required' } });
  }
  if (new Date(start_time) >= new Date(end_time)) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'start_time must be before end_time' } });
  }

  const resource = await resourceModel.findById(id);
  if (!resource) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'resource not found' } });
  }
  if (resource.provider_id !== req.user.id) {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'only the listing provider can set its availability' } });
  }

  const window = await resourceModel.addAvailability(id, start_time, end_time);
  res.status(201).json(window);
}

async function listAvailability(req, res) {
  const { id } = req.params;
  const resource = await resourceModel.findById(id);
  if (!resource) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'resource not found' } });
  }
  const windows = await resourceModel.listAvailability(id);
  res.json({ results: windows });
}

module.exports = { listResources, createResource, addAvailability, listAvailability };
