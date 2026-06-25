const Company = require("../models/company.model");
const Job = require("../models/job.model");
const { successResponse, errorResponse } = require("../utils/response");

function requireRecruiter(req, res) {
  if (req.role !== "recruiter") {
    errorResponse(res, 403, "Only recruiters can access this resource");
    return false;
  }

  return true;
}

function parseRequirements(requirement) {
  if (Array.isArray(requirement)) {
    return requirement.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof requirement === "string") {
    return requirement
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

async function postJob(req, res) {
  try {
    if (!requireRecruiter(req, res)) return;

    const {
      title,
      description,
      requirement,
      experienceLevel,
      salary,
      location,
      jobType,
      position,
      company
    } = req.body;

    if (
      !title?.trim() ||
      !description?.trim() ||
      !experienceLevel?.trim() ||
      !salary ||
      !location?.trim() ||
      !jobType?.trim() ||
      !position?.trim() ||
      !company
    ) {
      return errorResponse(res, 400, "All fields are required");
    }

    const salaryValue = Number(salary);

    if (Number.isNaN(salaryValue) || salaryValue < 0) {
      return errorResponse(res, 400, "Salary must be a valid number");
    }

    const requirementArray = parseRequirements(requirement);

    if (requirementArray.length === 0) {
      return errorResponse(res, 400, "At least one requirement is required");
    }

    const recruiterCompany = await Company.findOne({ _id: company, userId: req.id });

    if (!recruiterCompany) {
      return errorResponse(res, 404, "Company not found or unauthorized");
    }

    const job = await Job.create({
      title: title.trim(),
      description: description.trim(),
      requirement: requirementArray,
      experienceLevel: experienceLevel.trim(),
      salary: salaryValue,
      location: location.trim(),
      jobType,
      position: position.trim(),
      company,
      createdUser: req.id
    });

    return successResponse(res, 201, "Job posted successfully", { job });
  } catch (err) {
    console.log(err);
    return errorResponse(res, 500, "Something went wrong");
  }
}

async function getAllJobs(req, res) {
  try {
    const keyword = req.query.keyword || "";

    const query = keyword
      ? {
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
            { location: { $regex: keyword, $options: "i" } }
          ]
        }
      : {};

    const jobs = await Job.find(query)
      .populate("company")
      .sort({ createdAt: -1 });

    return successResponse(res, 200, "Jobs fetched successfully", { jobs });
  } catch (err) {
    console.log(err);
    return errorResponse(res, 500, "Something went wrong");
  }
}

async function getJobId(req, res) {
  try {
    const job = await Job.findById(req.params.id).populate("company");

    if (!job) {
      return errorResponse(res, 404, "Job not found");
    }

    return successResponse(res, 200, "Job fetched successfully", { job });
  } catch (err) {
    console.log(err);
    return errorResponse(res, 500, "Something went wrong");
  }
}

async function getAdminJob(req, res) {
  try {
    if (!requireRecruiter(req, res)) return;

    const jobs = await Job.find({ createdUser: req.id })
      .populate("company")
      .sort({ createdAt: -1 });

    return successResponse(res, 200, "Recruiter jobs fetched successfully", { jobs });
  } catch (err) {
    console.log(err);
    return errorResponse(res, 500, "Something went wrong");
  }
}

async function closeJob(req, res) {
  try {
    if (!requireRecruiter(req, res)) return;

    const job = await Job.findOneAndUpdate(
      {
        _id: req.params.id,
        createdUser: req.id
      },
      {
        status: "closed"
      },
      {
        new: true
      }
    );

    if (!job) {
      return errorResponse(res, 404, "Job not found or unauthorized");
    }

    return successResponse(res, 200, "Job closed successfully", { job });
  } catch (err) {
    console.log(err);
    return errorResponse(res, 500, "Something went wrong");
  }
}

module.exports = {
  postJob,
  getAdminJob,
  getJobId,
  getAllJobs,
  closeJob
};
