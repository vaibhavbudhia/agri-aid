// Insurance claim creation + document upload. Not implemented — Phase 5.

async function createClaim(req, res) {
  // TODO: insert insurance_claims row
  res.status(501).json({ error: 'not implemented' });
}

async function uploadClaimDocument(req, res) {
  // TODO: upload file to Supabase Storage, insert claim_documents row
  res.status(501).json({ error: 'not implemented' });
}

module.exports = { createClaim, uploadClaimDocument };
