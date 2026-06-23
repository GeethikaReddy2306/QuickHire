const Company = require("../models/company.model");

// Register Company
async function registerCompany(req, res) {
  try {
    const { name, description, website, location } = req.body;

    if (!name || !description || !website || !location) {
      return res.status(400).json({
        message: "All company fields are required",
        success: false
      });
    }

    let company = await Company.findOne({ name });

    if (company) {
      return res.status(400).json({
        message: "Company already exists",
        success: false
      });
    }

    company = await Company.create({
      name,
      description,
      website,
      location,
      userId: req.id
    });

    return res.status(201).json({
      message: "Company registered successfully",
      company,
      success: true
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong",
      success: false
    });
  }
}

// Get all companies of logged in recruiter
async function getCompany(req, res) {
  try {
    const userId = req.id;

    const companies = await Company.find({ userId });

    return res.status(200).json({
      companies,
      success: true
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong",
      success: false
    });
  }
}

// Get company by id
async function getCompanyId(req, res) {
  try {
    const companyId = req.params.id;

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false
      });
    }

    return res.status(200).json({
      company,
      success: true
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong",
      success: false
    });
  }
}

// Update company
async function updateCompany(req, res) {
  try {
    const { name, description, website, location } = req.body;
    const id = req.params.id;

    const updateData = {
      name,
      description,
      website,
      location
    };

    const company = await Company.findByIdAndUpdate(id, updateData, {
      new: true
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false
      });
    }

    return res.status(200).json({
      message: "Company updated successfully",
      company,
      success: true
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong",
      success: false
    });
  }
}

module.exports = {
  registerCompany,
  getCompany,
  getCompanyId,
  updateCompany
};