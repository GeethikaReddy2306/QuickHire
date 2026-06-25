const express = require("express");
const router = express.Router();

const {
  applyJob,
  getAppliedJob,
  getApplicants,
  updateStatus
} = require("../controllers/application.controller");

const isAuthenticated = require("../middleware/auth");

router.post("/apply/:id", isAuthenticated, applyJob);
router.get("/apply/:id", isAuthenticated, applyJob);
router.get("/get", isAuthenticated, getAppliedJob);
router.get("/:id/applicants", isAuthenticated, getApplicants);
router.patch("/status/:id", isAuthenticated, updateStatus);
router.post("/status/:id/update", isAuthenticated, updateStatus);

module.exports = router;
