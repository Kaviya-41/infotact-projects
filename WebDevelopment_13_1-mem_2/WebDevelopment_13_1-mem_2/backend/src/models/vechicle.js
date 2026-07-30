const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true,
    unique: true,
  },

  driverName: {
    type: String,
    required: true,
  },

  latitude: {
    type: Number,
    required: true,
  },

  longitude: {
    type: Number,
    required: true,
  },

  speed: {
    type: Number,
    default: 0,
  },

  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },

  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});


vehicleSchema.index({ status: 1 });
vehicleSchema.index({ lastUpdated: -1 });


module.exports = mongoose.model("Vehicle", vehicleSchema);