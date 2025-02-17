const express = require("express");
const router = express.Router();
const rideController = require("../controller/ride.controller");
const authmiddleware = require("../middleware/authmiddleware");

router.post("/create-ride", authmiddleware.rideAuth, rideController.createride);

module.exports = router;
