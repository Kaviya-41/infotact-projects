/**
 * Central route index
 *
 * Import and mount all route modules here.
 * Future phases will add vehicle, trip, alert, and auth routes.
 */

const { Router } = require('express');
const healthRoutes = require('./healthRoutes');

const router = Router();

// --- Health -----------------------------------------------------------------
router.use('/', healthRoutes);

// --- Future routes (Phase 2+) -----------------------------------------------
// router.use('/auth',     authRoutes);
// router.use('/vehicles', vehicleRoutes);
// router.use('/trips',    tripRoutes);
// router.use('/alerts',   alertRoutes);
// router.use('/dashboard', dashboardRoutes);

module.exports = router;
