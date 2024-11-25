const express = require("express");
const multer =require("multer");
const authController = require("../../controllers/userController");
const router = express.Router();

router.post("/user/register", authController.register);

module.exports = router;