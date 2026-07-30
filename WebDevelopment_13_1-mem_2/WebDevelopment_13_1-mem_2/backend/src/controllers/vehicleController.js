const Vehicle = require("../models/vechicle");

const getVehicles = async(req,res)=>{
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
    }


const createVehicle = async(req,res)=>{
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
  };

const getVehicleById = async(req,res)=>{
 

     try {
       const vehicle = await Vehicle.findById(req.params.id);
 
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
   }

const updateVehicle = async(req,res)=>{

      try {
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );
  
        if (!updatedVehicle) {
          return res.status(404).json({
            message: "Vehicle not found",
          });
        }
  
        res.status(200).json({
          message: "Vehicle updated successfully",
          data: updatedVehicle,
        });
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
    }

const deleteVehicle = async(req,res)=>{
 
      try {
        const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
  
        if (!deletedVehicle) {
          return res.status(404).json({
            message: "Vehicle not found",
          });
        }
  
        res.status(200).json({
          message: "Vehicle deleted successfully",
          data: deletedVehicle,
        });
      } catch (error) {
    console.error("POST Error:", error);
  
    res.status(500).json({
      message: error.message,
    });
  }
    };
module.exports = {
  getVehicles,
  createVehicle,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};

