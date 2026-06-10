const mongoose=require('mongoose');
const jobSchema=new mongoose.Schema({
        title:{
                type:String,
                required:true
        },description:{
                type:String,
                required:true
        },requirement:[{
                type:String
        }],salary:{
                type:Number,
                default:"As per comapay bases"
        },location:{
                type:String,
                required:true
        },jobType:{
                type:String,
                enum:['Full-Time','Remote','Contract','Hybrid','InternShip'],
                default:'Full-Time'
        },position:{
                type:String,
                required:true
        },company:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Company',
                requires:true
        },createdUser:{
               type:mongoose.Schema.Types.ObjectId,
                ref:'User',
                required:true
        },applications:[{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Application'
        }]

        
});
  const Job=mongoose.model('Job',jobSchema);
   module.exports=Job;