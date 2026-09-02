/**
 * Vehicle Model
 *
 * Represents a fleet vehicle with telemetry data (location, speed, fuel, status).
 */

const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: [true, 'Vehicle ID is required'],
      unique: true,
      trim: true,
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    make: {
      type: String,
      required: [true, 'Make is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    year: {
      type: Number,
      min: 1900,
      max: 2100,
    },
    type: {
      type: String,
      enum: ['truck', 'van', 'car', 'bus', 'motorcycle', 'other'],
      default: 'truck',
    },
    driverName: {
      type: String,
      trim: true,
      default: '',
    },
    driverPhone: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'maintenance'],
      default: 'offline',
    },
    fuelLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    currentSpeed: {
      type: Number,
      min: 0,
      default: 0,
    },
    location: {
      latitude: {
        type: Number,
        min: -90,
        max: 90,
        default: 0,
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180,
        default: 0,
      },
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------
vehicleSchema.index({ status: 1 });
// vehicleId and registrationNumber indexes created automatically by unique: true

// ---------------------------------------------------------------------------
// toJSON transform
// ---------------------------------------------------------------------------
vehicleSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
