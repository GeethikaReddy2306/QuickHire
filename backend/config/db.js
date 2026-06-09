
const mongoose=require('mongoose');
async function db(){
       
        await mongoose.connect(process.env.MONGO_URL);

}
db().then((res)=>{console.log("db connected")})
.catch((err)=>{console.log(err)});
module.exports=db;