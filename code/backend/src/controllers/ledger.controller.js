// Farm expense/revenue ledger. Not implemented — Phase 4.

async function addLedgerEntry(req, res) {
  // TODO: insert ledger_entries row
  res.status(501).json({ error: 'not implemented' });
}

async function getLedgerSummary(req, res) {
  // TODO: sum expense/revenue by crop_cycle for req.user.id
  res.status(501).json({ error: 'not implemented' });
}

module.exports = { addLedgerEntry, getLedgerSummary };
