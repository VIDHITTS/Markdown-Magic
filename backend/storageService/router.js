const express = require("express");

const { creator,getallCodes } = require("./controller.js");
const { middleware } = require("./middleware");
const router = express.Router();
router.use(middleware)
router.post("/create",creator)
router.get("/all",getallCodes)

module.exports = router;    