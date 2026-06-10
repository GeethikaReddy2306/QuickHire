const Company = require("../models/company.model");

// Register Company
async function registerCompany(req, res) {
    try {
        const { companyName } = req.body;

        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required",
                success: false
            });
        }

        let company = await Company.findOne({ name: companyName });

        if (company) {
            return res.status(400).json({
                message: "You cannot register the same company twice",
                success: false
            });
        }

        company = await Company.create({
            name: companyName,
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

// Get All Companies of Logged-in User
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

// Get Company By ID
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

// Update Company
async function updateCompany(req, res) {
    try {
        const { name, description, website, location } = req.body;
        const id = req.params.id;

        // Later implement Cloudinary for logo upload
        const updateData = {
            name,
            description,
            website,
            location
        };

        const company = await Company.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company info updated successfully",
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