const express = require("express");
const { register, login, logout, getMe } = require("./controller.js");
const { middleware: authenticate } = require("../storageService/middleware.js");
const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/me", authenticate, getMe)

module.exports = router;