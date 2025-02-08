const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");

module.exports.userAuth = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    c;
    console.log(err);
    res.status(401).json({
      message: "Error occured",
    });
  }
};
