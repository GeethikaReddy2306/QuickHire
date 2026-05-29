const mongoose=require('mongoose');
const dns=require('dns');
require('dotenv').config();
dns.setServers(['1.1.1.1','8.8.8.8']);
async function db() {
    await  mongoose.connect(process.env.MONGO_URL);
        
}
db().then((res)=>{console.log("DB connected")})
.catch((err)=>{console.log(err)});
module.exports=db;
