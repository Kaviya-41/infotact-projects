const processCoordinates = require("../services/workerService");
const { logInfo, logError } = require("../utils/logger");

// Receives request
const processCoordinate = async (req, res) => {
    try 
    {
        logInfo("Coordinate processing request received.");
        const result = await processCoordinates(req.body);
            if (result.error) {
                return res.status(400).json({
                    success: false,
                    message: result.error
                });
            }

            res.status(200).json({
                success: true,
                message: "Coordinate processed successfully.",
                data: result
            });
            logInfo("Controller Received Coordinate");
    } 
    catch (err) 
    {
        logError(err.message);
        res.status(500).json({
            error: err.message
        });
    }
};

module.exports = {
    processCoordinate
};