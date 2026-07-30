const express = require("express");
const Vehicle = require("./models/vechicle");
const coordinateRoutes = require("./routes/coordinateRoutes");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

app.use("/api", coordinateRoutes);

app.get("/", (req, res) => {
  res.send("FleetDash Backend Running");
});        // home page

app.post("/vehicles", async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);

    await vehicle.save();

    res.status(201).json({
      message: "Vehicle added successfully",
      data: vehicle,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});            // add vehicle to database

app.get("/vehicles", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();

    res.status(200).json({
      message: "Vehicles fetched successfully",
      data: vehicles,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});             // retrive all vehicles

app.get("/vehicles/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      message: "Vehicle fetched successfully",
      data: vehicle,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});        // retrive vehicle by id

module.exports = app;