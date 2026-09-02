/**
 * Central route index
 *
 * Import and mount all route modules here.
 * Future phases will add vehicle, trip, alert, and dashboard routes.
 */

const { Router } = require('express');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');

const router = Router();

// --- Health -----------------------------------------------------------------
router.use('/', healthRoutes);

// --- Auth -------------------------------------------------------------------
router.use('/auth', authRoutes);

// --- Future routes (Phase 5+) -----------------------------------------------
// router.use('/vehicles', vehicleRoutes);
// router.use('/trips',    tripRoutes);
// router.use('/alerts',   alertRoutes);
// router.use('/dashboard', dashboardRoutes);

module.exports = router;

