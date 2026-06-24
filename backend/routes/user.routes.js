const express = require("express");
const router = express.Router();

const {
  registerUser,
  login,
  updateProfile
} = require("../controllers/user.controller");

const isAuthenticated = require("../middleware/auth");
const upload = require("../middleware/multer");

router.post("/register", registerUser);
router.post("/login", login);

// resume file field name = "resume"
router.put(
  "/profile/update",
  isAuthenticated,
  upload.single("resume"),
  updateProfile
);

module.exports = router;