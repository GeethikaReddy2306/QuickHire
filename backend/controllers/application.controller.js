const Application = require("../models/application.model");
const Job = require("../models/job.model");
const { successResponse, errorResponse } = require("../utils/response");

function requireRole(req, res, role, message) {
  if (req.role !== role) {
    errorResponse(res, 403, message);
    return false;
  }

  return true;
}

async function applyJob(req, res) {
  try {
    if (!requireRole(req, res, "student", "Only students can apply for jobs")) return;

    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) {
      return errorResponse(res, 400, "Job id is required");
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return errorResponse(res, 404, "Job not found");
    }

    if (job.status === "closed") {
      return errorResponse(res, 400, "This job is closed. Applications are no longer accepted.");
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId
    });

    if (existingApplication) {
      return errorResponse(res, 409, "You have already applied for this job");
    }

    const application = await Application.create({
      job: jobId,
      applicant: userId
    });

    job.applications.push(application._id);
    await job.save();

    return successResponse(res, 201, "Job applied successfully", { application });
  } catch (err) {
    console.log(err);
    return errorResponse(res, 500, "Something went wrong");
  }
}

async function getAppliedJob(req, res) {
  try {
    if (!requireRole(req, res, "student", "Only students can view applied jobs")) return;

    const application = await Application.find({ applicant: req.id })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: {
          path: "company"
        }
      });

    return successResponse(res, 200, "Applied jobs fetched successfully", { application });
  } catch (err) {
    console.log(err);
    return errorResponse(res, 500, "Something went wrong");
  }
}

async function getApplicants(req, res) {
  try {
    if (!requireRole(req, res, "recruiter", "Only recruiters can view applicants")) return;

    const job = await Job.findOne({ _id: req.params.id, createdUser: req.id })
      .populate("company")
      .populate({
        path: "applications",
        options: {
          sort: { createdAt: -1 }
        },
        populate: {
          path: "applicant",
          select: "name email phoneNumber role profile"
        }
      });

    if (!job) {
      return errorResponse(res, 404, "Job not found or unauthorized");
    }

    return successResponse(res, 200, "Applicants fetched successfully", { job });
  } catch (err) {
    console.log(err);
    return errorResponse(res, 500, "Something went wrong");
  }
}

async function updateStatus(req, res) {
  try {
    if (!requireRole(req, res, "recruiter", "Only recruiters can update application status")) return;

    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return errorResponse(res, 400, "Status is required");
    }

    const normalizedStatus = status.toLowerCase();
    const validStatus = ["pending", "accepted", "rejected"];

    if (!validStatus.includes(normalizedStatus)) {
      return errorResponse(res, 400, "Invalid status");
    }

    const application = await Application.findById(applicationId).populate("job");

    if (!application) {
      return errorResponse(res, 404, "Application not found");
    }

    if (String(application.job.createdUser) !== String(req.id)) {
      return errorResponse(res, 403, "You are not authorized to update this application");
    }

    application.status = normalizedStatus;
    await application.save();

    return successResponse(res, 200, "Status updated successfully", { application });
  } catch (err) {
    console.log(err);
    return errorResponse(res, 500, "Something went wrong");
  }
}

module.exports = { applyJob, getAppliedJob, updateStatus, getApplicants };
