const express = require("express");

const { creator, getallCodes, getCodebyId, deleteCode, updateCode, updateMetadata } = require("./controller.js");
const { middleware } = require("./middleware");

const router = express.Router();

router.use(middleware)

router.post("/create", creator)
router.get("/all", getallCodes)
router.get("/:id", getCodebyId)
router.delete("/:id", deleteCode)
router.put("/:id", updateCode)
router.patch("/:id/metadata", updateMetadata)

module.exports = router;    