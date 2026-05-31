const mongoose=require('mongoose');
const dns=require('dns');
require('dotenv').config();
const Job=require('../modules/job/job.model');
const User=require('../modules/user/user.model');
const company=require('../modules/company/company.model');
const Application=require('../modules/application/application.model');
dns.setServers(['1.1.1.1','8.8.8.8']);
async function db() {
    await  mongoose.connect(process.env.MONGO_URL);
        
}
db().then((res)=>{console.log("DB connected")})
.catch((err)=>{console.log(err)});
module.exports=db;
