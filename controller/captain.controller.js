const captainmodel = require("../model/captainmodel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blackListedtoken = require("../model/blackListedtoken");

module.exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const captain = await captainmodel.findOne({ email });
    if (captain) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const newcaptain = new captainmodel({
      name,
      email,
      password: hash,
    });
    await newcaptain.save();

    const token = jwt.sign({ id: newcaptain._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token);
    res.send({
      message: "captain registered Successfully",
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
    const captain = await captainmodel.findOne({ email }).select("+password");

    if (!captain) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
    const isMatch = await bcrypt.compare(password, captain.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }
    const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token);
    res.send({
      message: "captain logged in Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    await blackListedtoken.create({ token });
    res.clearCookie("token");
    res.send({
      message: "captain logged out Successfully",
    });
  } catch (error) {
    console.log("Error when logged out", error);
  }
};

module.exports.profile = async (req, res) => {
  try {
    console.log("progile", req.captain);
    res.send(req.captain);
  } catch (error) {
    res.status(500).json({
      message: "Error when getting captain profile",
    });
    console.log("Error when getting profile", error);
  }
};

module.exports.toggleAvailability = async (req, res) => {
  try {
    const captain = await captainmodel.findById(req.captain._id);
    captain.isAvailable = !captain.isAvailable;
    await captain.save();
    res.send(captain);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
