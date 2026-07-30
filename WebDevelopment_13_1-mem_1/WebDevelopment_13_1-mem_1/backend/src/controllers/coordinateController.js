const processCoordinates = require("../services/workerService");
const { logInfo, logError } = require("../utils/logger");
const Vehicle = require("../models/vechicle");

// Process a single coordinate
const processCoordinate = async (req, res) => {
    try {
        const startTime = Date.now();
        logInfo("Coordinate processing request received.");

        const result = await processCoordinates(req.body);

        if (result.error) {
            return res.status(400).json({
                success: false,
                message: result.error
            });
        }

        const updatedVehicle = await Vehicle.findOneAndUpdate(
            { vehicleId: result.vehicleId },
            {
                latitude: result.latitude,
                longitude: result.longitude,
                speed: req.body.speed || 0,
                lastUpdated: new Date()
            },
            {
                returnDocument: "after"
            }
        );

        const endTime = Date.now();
        const processingTime = endTime - startTime;

        logInfo(`Coordinate processed in ${processingTime} ms`);

        if (!updatedVehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found. Please register the vehicle first using POST /vehicles."
            });
        }

        logInfo("Vehicle location updated in MongoDB.");
        logInfo("Controller Received Coordinate");

        res.status(200).json({
            success: true,
            message: "Coordinate processed successfully.",
            processingTime: `${processingTime} ms`,
            data: updatedVehicle
        });

    } catch (err) {
        logError(err.message);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Process multiple coordinates
const processCoordinatesBatch = async (req, res) => {
    try {
        logInfo("Batch coordinate processing request received.");

        const coordinates = req.body;

        if (!Array.isArray(coordinates)) {
            return res.status(400).json({
                success: false,
                message: "Request body must be an array."
            });
        }

        const updates = [];

        for (const coordinate of coordinates) {

            const result = await processCoordinates(coordinate);

            if (result.error) {
                return res.status(400).json({
                    success: false,
                    message: result.error
                });
            }

            updates.push({
                updateOne: {
                    filter: {
                        vehicleId: result.vehicleId
                    },
                    update: {
                        $set: {
                            latitude: result.latitude,
                            longitude: result.longitude,
                            speed: coordinate.speed || 0,
                            lastUpdated: new Date()
                        }
                    }
                }
            });
        }

        const dbResult = await Vehicle.bulkWrite(updates);

        logInfo("Bulk database update completed.");
        logInfo(`Matched Vehicles: ${dbResult.matchedCount}`);
        logInfo(`Modified Vehicles: ${dbResult.modifiedCount}`);

        if (dbResult.matchedCount !== coordinates.length) {
            logInfo("Some vehicle IDs were not found in the database.");
        }

        res.status(200).json({
            success: true,
            message: "Batch processed successfully.",
            totalReceived: coordinates.length,
            matched: dbResult.matchedCount,
            modified: dbResult.modifiedCount
        });

    } catch (err) {
        logError(err.message);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    processCoordinate,
    processCoordinatesBatch
};