/**
 * FleetDash Backend — Environment Configuration
 *
 * Centralises all environment variables so the rest of the app
 * imports from here instead of reading process.env directly.
 */

require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT, 10) || 5050,
  mongodbUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  redisUrl: process.env.REDIS_URL || '',
  nodeEnv: process.env.NODE_ENV || 'development',

  // Frontend origin for CORS — default matches Vite dev server
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};

module.exports = config;
