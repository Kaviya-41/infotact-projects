const express = require("express");
const coordinateRoutes = require("./routes/coordinateRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");

const app = express();

app.use(express.json());

// Logger
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("FleetDash Backend Running");
});

app.use("/api", coordinateRoutes);
app.use("/vehicles", vehicleRoutes);

// 404 Handler (always last)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;