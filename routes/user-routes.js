const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const authController = require("../middleware/authmiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/profile", authController.userAuth);
module.exports = router;
