const { parentPort } = require("worker_threads");

const parseCoordinate = require("../parser/coordinateParser");
const { logInfo } = require("../utils/logger");

//parentPort is used by worker to communicate with Main server
parentPort.on("message", (data) => {
    try 
    {
        logInfo("Worker started processing coordinates.");
        const processed = parseCoordinate(data);
        logInfo("Coordinate processed.");
        parentPort.postMessage(processed);
    }
    catch (err) 
    {
        parentPort.postMessage({error: err.message});
    }
});