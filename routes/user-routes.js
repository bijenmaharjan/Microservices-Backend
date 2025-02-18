const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const authmiddleware = require("../middleware/authmiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.get("/profile", authmiddleware.userAuth, userController.profile);
router.get(
  "/accepted-ride",
  authmiddleware.userAuth,
  userController.acceptedRide
);
module.exports = router;
