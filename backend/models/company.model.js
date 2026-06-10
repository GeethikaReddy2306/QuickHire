 const mongoose=require('mongoose');
const companySchema=new mongoose.Schema({
        companyName:{
                type:String,
                required:true,
                unique:true
        },description:{
                type:String,
                required:true
        },website:{
                type:String,
                required:true
        },location:{
                type:String,
                required:true
        },logo:{
                type:String,
                requires:true
        },userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Application'

        }
})
 const Company=mongoose.model('Company',companySchema);
   module.exports=Company;