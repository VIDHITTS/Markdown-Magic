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

// Middleware to optionally check auth (attach user if authenticated, but don't block)
const optionalAuth = (req, res, next) => {
  middleware(req, res, (err) => {
    // If there's an error (no auth), just continue without user
    next();
  });
};

// Public route - can be accessed without authentication, but includes user data if authenticated
router.get("/browse", optionalAuth, getPublicProjects);

// Protected routes - require authentication
router.use(middleware);

// IMPORTANT: More specific routes must come before parameterized routes
router.get("/user/likes", getUserLikes);
router.post("/like/:id", likeProject);
router.delete("/unlike/:id", unlikeProject);
router.post("/fork/:id", forkProject);
router.get("/:id/likes", getProjectLikes);

module.exports = router;
