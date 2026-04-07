const express = require("express");
const router = express.Router();
const adminControllers = require("../controllers/admin");
const { authorization } = require("../middlewares/authorization");
const { checkRole } = require("../middlewares/roleAuth");
const wrapAsync = require("../middlewares/wrapAsync");

// All admin routes require admin role
router.use(authorization);
router.use(checkRole(['admin']));

// Get platform statistics
router.get("/stats", wrapAsync(adminControllers.getPlatformStats));

// Get reported content
router.get("/reports", wrapAsync(adminControllers.getReportedContent));

// Dismiss report from content
router.post("/dismiss/:type/:id", wrapAsync(adminControllers.dismissReport));

module.exports = router;
