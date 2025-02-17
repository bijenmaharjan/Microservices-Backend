const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const authController = require("../middleware/authmiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.get("/profile", authController.userAuth, userController.profile);
module.exports = router;
