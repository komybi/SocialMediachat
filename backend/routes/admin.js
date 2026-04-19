const express = require("express");
const router = express.Router();
const adminControllers = require("../controllers/admin");
const { authorization } = require("../middlewares/authorization");
const { checkRole } = require("../middlewares/roleAuth");
const wrapAsync = require("../middlewares/wrapAsync");

// All admin routes require authentication (temporarily removed admin role for testing)
router.use(authorization);
// router.use(checkRole(['admin'])); // Temporarily commented for testing

// Get platform statistics
router.get("/stats", wrapAsync(adminControllers.getPlatformStats));

// Get all users
router.get("/users", wrapAsync(adminControllers.getAllUsers));

// Create test user (for testing only)
router.post("/create-test-user", wrapAsync(async (req, res) => {
  try {
    const User = require("../models/user");
    const bcrypt = require("bcryptjs");
    
    const testUser = new User({
      firstName: "Test",
      lastName: "User",
      email: "test@bhu.edu.et",
      password: bcrypt.hashSync("password123", 8),
      role: "student",
      department: "Computer Science"
    });
    
    await testUser.save();
    res.status(200).json({ message: "Test user created successfully", user: testUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating test user", error: error.message });
  }
}));

// Get all posts
router.get("/posts", wrapAsync(adminControllers.getAllPosts));

// Get all reels
router.get("/reels", wrapAsync(adminControllers.getAllReels));

// Get all resources
router.get("/resources", wrapAsync(adminControllers.getAllResources));

// Get all chats
router.get("/chats", wrapAsync(adminControllers.getAllChats));

// Delete user
router.delete("/users/:id", wrapAsync(adminControllers.deleteUser));

// Delete post
router.delete("/posts/:id", wrapAsync(adminControllers.deletePost));

// Delete reel
router.delete("/reels/:id", wrapAsync(adminControllers.deleteReel));

// Get reported content
router.get("/reports", wrapAsync(adminControllers.getReportedContent));

// Dismiss report from content
router.post("/dismiss/:type/:id", wrapAsync(adminControllers.dismissReport));

module.exports = router;
