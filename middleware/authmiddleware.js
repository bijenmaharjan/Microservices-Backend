const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config();

module.exports.rideAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          message: "Invalid or expired token",
        });
      }
      return res.status(500).json({
        message: error.message,
      });
    }

    const response = await axios.get(`${process.env.BASE_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response || !response.data) {
      return res.status(401).json({
        message: "User profile fetch failed",
      });
    }

    const user = response.data;

    req.user = user;
    console.log("User profile:", user);
    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
