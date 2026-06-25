const express = require("express");
const router = express.Router();

const {
  registerUser,
  login,
  updateProfile,
  downloadResume
} = require("../controllers/user.controller");

const isAuthenticated = require("../middleware/auth");
const upload = require("../middleware/multer");

router.post("/register", registerUser);
router.post("/login", login);
router.get("/test", (req, res) => {
  res.json({ message: "working" });
});
router.get("/resume/:id", isAuthenticated, downloadResume);
router.put(
  "/profile/update",
  isAuthenticated,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "photo", maxCount: 1 }
  ]),
  updateProfile
);

module.exports = router;
