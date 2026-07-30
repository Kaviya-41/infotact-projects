const express = require("express");
const router = express.Router();
const {
  getVehicles,
  createVehicle,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

router
  .route("/")
  .get(getVehicles)
  .post(createVehicle);

 router.route("/:id")
  .get(getVehicleById)
  .put(updateVehicle)
  .delete(deleteVehicle);

module.exports = router;