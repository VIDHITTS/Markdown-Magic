const express = require("express");

const {
  getPublicProjects,
  likeProject,
  unlikeProject,
  forkProject,
  getProjectLikes,
  getUserLikes,
} = require("./controller.js");
const { middleware } = require("../storageService/middleware");

const router = express.Router();



router.get("/browse", getPublicProjects);

router.use(middleware);

router.get("/user/likes", getUserLikes);
router.post("/like/:id", likeProject);
router.delete("/unlike/:id", unlikeProject);
router.post("/fork/:id", forkProject);
router.get("/:id/likes", getProjectLikes);

module.exports = router;
