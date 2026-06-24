const Company = require("../models/company.model");

// Register Company
async function registerCompany(req, res) {
  try {
    const { companyName, description, website, location, logo } = req.body;

    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required",
        success: false
      });
    }

    const existingCompany = await Company.findOne({
      companyName,
      userId: req.id
    });

    if (existingCompany) {
      return res.status(400).json({
        message: "You already registered this company",
        success: false
      });
    }

    const company = await Company.create({
      companyName,
      description: description || "",
      website: website || "",
      location: location || "",
      logo: logo || "",
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

// Get all companies of logged-in recruiter
async function getCompany(req, res) {
  try {
    const companies = await Company.find({ userId: req.id }).sort({
      createdAt: -1
    });

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

// Get single company by id
async function getCompanyId(req, res) {
  try {
    const company = await Company.findOne({
      _id: req.params.id,
      userId: req.id
    });

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
    const { companyName, description, website, location, logo } = req.body;
    const companyId = req.params.id;

    const company = await Company.findOne({
      _id: companyId,
      userId: req.id
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found or unauthorized",
        success: false
      });
    }

    if (companyName !== undefined) company.companyName = companyName;
    if (description !== undefined) company.description = description;
    if (website !== undefined) company.website = website;
    if (location !== undefined) company.location = location;
    if (logo !== undefined) company.logo = logo;

    await company.save();

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