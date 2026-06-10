const Job = require('../models/job.model');

async function postJob(req, res) {
    try {
const {title,description,requirement,experienceLevel,salary,location,jobType,position,company} = req.body;

if (!title ||!description ||!requirement||!experienceLevel ||!salary ||!location ||!jobType ||!position ||!company) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

const job = await Job.create({ title,
        description,experienceLevel,
        requirement,salary:Number(salary),location,jobType,position,company,createdUser: req.id });

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
async function getAllJobs(req, res) {
    try {
        const keyword = req.query.keyword || "";

        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        };

        const jobs = await Job.find(query)
            .populate("company")
            .sort({ createdAt: -1 });
            if(!jobs){
                return res.status(404).json({
                        message:'job not found',
                        success:false
                })
            }
        return res.status(200).json({
            jobs,
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
async function getJobId(req,res){
        try{
                const jobId=req.params.id;
                const job=await Job.findById(jobId);
                if(!job){
                        return res.status(404).json({
                                message:'Job not found',
                                success:false
                        })
                };
                return res.status(200).json({job,sucess:true});

        }catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Something went wrong",
            success: false
        });
    }
}
async function getAdminJob(req,res){
        try{
                const adminId=req.id;
                const jobs=await Job.find({created_by:adminId});
                if(!jobs){
                        return res.status(404).json({
                                message:"Job not found",
                                success:false
                        })
                }
                res.status(200).json({
                        jobs,
                        success:true
                })

        }catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Something went wrong",
            success: false
        });
    }
}
module.exports = { postJob,getAdminJob,getJobId,getAllJobs};