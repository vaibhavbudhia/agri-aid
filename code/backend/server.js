// Entry point. Auth, profile, resources, bookings, and breakdowns are
// fully implemented against a real database. Labour, ledger, schemes,
// claims, and admin remain 501 stubs — Phases 4-5.

const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/auth.routes');
const profileRoutes = require('./src/routes/profile.routes');
const resourceRoutes = require('./src/routes/resources.routes');
const bookingRoutes = require('./src/routes/bookings.routes');
const breakdownRoutes = require('./src/routes/breakdown.routes');
const labourRoutes = require('./src/routes/labour.routes');
const ledgerRoutes = require('./src/routes/ledger.routes');
const schemeRoutes = require('./src/routes/schemes.routes');
const claimRoutes = require('./src/routes/claims.routes');
const adminRoutes = require('./src/routes/admin.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/breakdowns', breakdownRoutes);
app.use('/api/labour-requests', labourRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`AgriAid backend on :${PORT}`));
