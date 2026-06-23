const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
      name:  {
                type:String,
                required:true,
                
        },email:{
                type:String,
                required:true,
                unique:true
        },phoneNumber:{
                type:Number,
                required:true,
                unique:true
        },password:{
                type:String,
                required:true
        },role:{
                type:String,
                enum:['student','recruiter'],
                default:'employee'
        },profile:{bio:{
                type:String,
                default:''

        },skills:[{
                type:String,
        }],resume:{
                type:String
                
        },resumeOriginalName:{
                type:String,
                
        },
        company:{type:mongoose.Schema.Types.ObjectId,ref:'Company'},
                photo:{
                type:String,
                default:" "
        }
}},{
                timestamps:true
        });
        const User=mongoose.model('User',userSchema);
   module.exports=User;