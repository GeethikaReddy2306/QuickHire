const mongoose=require('mongoose');
const  jobSchema=new mongoose.Schema({
        title:String,
        description:String,
        location:String,
        salary:Number,
        jobType:String,
        experienceLevel:Number,
        skills:[String],
        openings:Number,
        company:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Company'}
        },
                {
        timestamps: true
                });
const Job=mongoose.model('job',jobSchema);
module.exports=Job;