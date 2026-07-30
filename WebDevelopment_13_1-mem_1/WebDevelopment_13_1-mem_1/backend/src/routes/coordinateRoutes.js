const express = require("express");

const router = express.Router();

const {
    processCoordinate,
    processCoordinatesBatch
} = require("../controllers/coordinateController");

const validateCoordinate = require("../middleware/validateCoordinate");

router.get("/health", (req, res) => {
    res.json({
        status: "Running",
        service: "FleetDash Backend"
    });
});

router.post(
    "/process-coordinate",
    validateCoordinate,
    processCoordinate
);

router.post(
    "/process-coordinates",
    processCoordinatesBatch
);

module.exports = router;