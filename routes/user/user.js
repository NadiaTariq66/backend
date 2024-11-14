const express = require("express");
const multer =require("multer");
const userController = require("../../controllers/userController");
const router = express.Router();

router.post("/user/register", userController.userRegister);

module.exports = router;