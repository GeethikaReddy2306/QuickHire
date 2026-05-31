const app=require('./src/app');
const db=require("./src/config/db");
app.listen(process.env.PORT,()=>{
        console.log("server is running successfully");
})
