const ridemodel = require("../model/ridemodel");
const {
  subscribeToQueue,
  publishToQueue,
} = require("../services/rabbitconnect");

module.exports.createride = async (req, res) => {
  try {
    const { pickup, destination } = req.body;
    console.log(req.body);
    const newRide = new ridemodel({
      user: req.user._id,
      pickup,
      destination,
    });

    await newRide.save();
    publishToQueue("new-ride", JSON.stringify(newRide));
    res.send(newRide);
  } catch (error) {
    res.status(501).json({
      message: error.message,
    });
  }
};
