const Company = require("../models/company.model");
const { successResponse, errorResponse } = require("../utils/response");

function requireRecruiter(req, res) {
  if (req.role !== "recruiter") {
    errorResponse(res, 403, "Only recruiters can access this resource");
    return false;
  }

  return true;
}

async function registerCompany(req, res) {
  try {
    if (!requireRecruiter(req, res)) return;

    const { companyName, description, website, location, logo } = req.body;

    if (!companyName?.trim()) {
      return errorResponse(res, 400, "Company name is required");
    }

    const existingCompany = await Company.findOne({
      companyName: companyName.trim(),
      userId: req.id
    });

    if (existingCompany) {
      return errorResponse(res, 409, "You already registered this company");
    }

    const company = await Company.create({
      companyName: companyName.trim(),
      description: description?.trim() || "",
      website: website?.trim() || "",
      location: location?.trim() || "",
      logo: logo?.trim() || "",
      userId: req.id
    });

    return successResponse(res, 201, "Company registered successfully", { company });
  } catch (err) {
    console.log(err);
    return errorResponse(res, 500, "Something went wrong");
  }
}

async function getCompany(req, res) {
  try {
    if (!requireRecruiter(req, res)) return;

    const companies = await Company.find({ userId: req.id }).sort({
      createdAt: -1
    });

    return successResponse(res, 200, "Companies fetched successfully", { companies });
  } catch (err) {
    console.log(err);
    return errorResponse(res, 500, "Something went wrong");
  }
}

async function getCompanyId(req, res) {
  try {
    if (!requireRecruiter(req, res)) return;

    const company = await Company.findOne({
      _id: req.params.id,
      userId: req.id
    });

    if (!company) {
      return errorResponse(res, 404, "Company not found");
    }

    return successResponse(res, 200, "Company fetched successfully", { company });
  } catch (err) {
    console.log(err);
    return errorResponse(res, 500, "Something went wrong");
  }
}

async function updateCompany(req, res) {
  try {
    if (!requireRecruiter(req, res)) return;

    const { companyName, description, website, location, logo } = req.body;
    const companyId = req.params.id;

    const company = await Company.findOne({
      _id: companyId,
      userId: req.id
    });

    if (!company) {
      return errorResponse(res, 404, "Company not found or unauthorized");
    }

    if (companyName !== undefined) {
      if (!companyName.trim()) {
        return errorResponse(res, 400, "Company name is required");
      }
      company.companyName = companyName.trim();
    }

    if (description !== undefined) company.description = description.trim();
    if (website !== undefined) company.website = website.trim();
    if (location !== undefined) company.location = location.trim();
    if (logo !== undefined) company.logo = logo.trim();

    await company.save();

    return successResponse(res, 200, "Company updated successfully", { company });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return errorResponse(res, 409, "You already registered this company");
    }
    return errorResponse(res, 500, "Something went wrong");
  }
}

module.exports = {
  registerCompany,
  getCompany,
  getCompanyId,
  updateCompany
};
