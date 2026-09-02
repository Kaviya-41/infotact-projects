/**
 * FleetDash Backend — Express Server
 *
 * Entry point for the FleetDash API server.
 * Loads config, mounts middleware & routes, and starts listening.
 */

const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// ---------------------------------------------------------------------------
// Initialise Express
// ---------------------------------------------------------------------------
const app = express();

// ---------------------------------------------------------------------------
// Global Middleware
// ---------------------------------------------------------------------------
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------------
app.use('/api', routes);

// ---------------------------------------------------------------------------
// Error Handling
// ---------------------------------------------------------------------------
app.use(notFound);       // 404 catch-all (must come after routes)
app.use(errorHandler);   // centralised error handler

// ---------------------------------------------------------------------------
// Start Server
// ---------------------------------------------------------------------------
app.listen(config.port, () => {
  console.log(`[FleetDash] Server running on http://localhost:${config.port}`);
  console.log(`[FleetDash] Health-check → GET http://localhost:${config.port}/api/health`);
});

module.exports = app;
