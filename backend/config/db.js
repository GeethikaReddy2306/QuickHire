
const mongoose=require('mongoose');
async function db(){
       
        await mongoose.connect(process.env.MONGO_URL);

}

module.exports=db;