const { Worker } = require("worker_threads");
const path = require("path");
const { logInfo, logError } = require("../utils/logger");

// function called by main server using VehicleData as argument
function processCoordinates(data) {
    logInfo("Worker Created.");
    // Promise is used to ensure API waits for result without blocking event loop.
    return new Promise((resolve, reject) => {
        const worker = new Worker(
            path.join(__dirname, "../workers/coordinateWorker.js")
        );
        worker.postMessage(data);  //sending data

        worker.on("message", (result) => {

            if (result.error) {
                logError(result.error);
            } else {
                logInfo("Coordinate Processed and sent to Controller");
            }

            resolve(result);
        });      // Receiving data

        worker.on("error", (err) => {
            reject(err);
        }); //Error Handling

    });
}

module.exports = processCoordinates;