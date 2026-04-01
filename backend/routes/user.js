const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user");
const wrapAsync = require("../middlewares/wrapAsync");
const { authorization } = require("../middlewares/authorization");

router.get("/profile", authorization, wrapAsync(userControllers.getAuthUser));
router.get("/users", authorization, wrapAsync(userControllers.getAllUsers));
router.post("/follow/:userId", authorization, wrapAsync(userControllers.followUser));
router.post("/unfollow/:userId", authorization, wrapAsync(userControllers.unfollowUser));

module.exports = router;
