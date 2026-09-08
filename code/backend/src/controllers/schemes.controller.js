// Scheme eligibility matching. Not implemented — Phase 5.

async function getEligibleSchemes(req, res) {
  // TODO: run req.user's profile against schemes.eligibility_rules (JSONB)
  res.status(501).json({ error: 'not implemented' });
}

module.exports = { getEligibleSchemes };
