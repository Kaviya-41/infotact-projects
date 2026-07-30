function validateCoordinate(req, res, next) 
{
    const { vehicleId, latitude, longitude } = req.body;
    if (!vehicleId || latitude === undefined || longitude === undefined)
    {
        return res.status(400).json({
            success: false,
            message: "vehicleId, latitude and longitude are required."
        });
    }
    if (isNaN(latitude) || isNaN(longitude))
    {
        return res.status(400).json({
            success: false,
            message: "Latitude and Longitude must be numbers."
        });
    }

    next();
}

module.exports = validateCoordinate;