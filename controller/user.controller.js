const userModel = require("../model/usermodel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blackListedtoken = require("../model/blackListedtoken");
const { subscribeToQueue } = require("../services/rabbitconnect");
const EventEmitter = require("events");
const rideEventEmitter = new EventEmitter();

module.exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      name,
      email,
      password: hash,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token);
    res.send({
      message: "User registered Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token);
    res.send({
      message: "User logged in Successfully",
    });
  } catch (error) {}
};

module.exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    await blackListedtoken.create({ token });
    res.clearCookie("token");
    res.send({
      message: "User logged out Successfully",
    });
  } catch (error) {
    console.log("Error when logged out", error);
  }
};

module.exports.profile = async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(500).json({
      message: "Error when getting user profile",
    });
    console.log("Error when getting profile", error);
  }
};

module.exports.acceptedRide = async (req, res) => {
  // Long polling: wait for 'ride-accepted' event
  rideEventEmitter.once("ride-accepted", (data) => {
    res.send(data);
  });

  // Set timeout for long polling (e.g., 30 seconds)
  setTimeout(() => {
    res.status(204).send();
  }, 30000);
};

subscribeToQueue("ride-accepted", async (msg) => {
  const data = JSON.parse(msg);
  rideEventEmitter.emit("ride-accepted", data);
});
