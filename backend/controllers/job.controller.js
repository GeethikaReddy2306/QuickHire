const Job = require('../models/job.model');

async function postJob(req, res) {
    try {
const {title,description,requirement,salary,location,jobType,position,company} = req.body;

if (!title ||!description ||!requirement ||!salary ||!location ||!jobType ||!position ||!company) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

const job = await Job.create({ title,description,requirement,salary,location,jobType,position,company,createdUser: req.id });

        return res.status(201).json({
            message: "Job posted successfully",
            job,
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

module.exports = { postJob };