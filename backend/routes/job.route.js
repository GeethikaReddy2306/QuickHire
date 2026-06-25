const express = require("express");
const router = express.Router();

const {
  postJob,
  getAdminJob,
  getJobId,
  getAllJobs,
  closeJob
} = require("../controllers/job.controller");

const isAuthenticated = require("../middleware/auth");

router.post("/post", isAuthenticated, postJob);
router.get("/get", isAuthenticated, getAllJobs);
router.get("/admin", isAuthenticated, getAdminJob);
router.get("/getadminJobs", isAuthenticated, getAdminJob);
router.get("/get/:id", isAuthenticated, getJobId);
router.patch("/close/:id", isAuthenticated, closeJob);

module.exports = router;
