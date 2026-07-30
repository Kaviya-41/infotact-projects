const express = require("express");

const router = express.Router();

const { processCoordinate } = require("../controllers/coordinateController");

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

router.post("/process-coordinate", processCoordinate);

module.exports = router;