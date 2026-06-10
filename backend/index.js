const express=require('express');
const app=express();
const cookieParser=require('cookie-parser');
const companyRoutes = require('./routes/company.routes');
const dotenv=require('dotenv');
const jobRoute=require('./routes/job.route');
const applicationRoute=require('./routes/application.routes');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const dns=require('dns');
dns.setServers(["1.1.1.1", "8.8.8.8"]);

//to avoid dns error
require('dotenv').config()
//packages
//connecting db
const db=require('./config/db');
db().then((res)=>{console.log("db connected")})
.catch((err)=>{console.log(err)});

const router=require('./routes/user.routes');
app.use('/api/user', router);
app.use('api/company',companyRoutes);
app.use('api/job',jobRoute);
app.use('api/application',jobRoute);
/*const coresOptions={
        origin:'http://localhost:5173',
        credentials:true
}*/
app.get('/', (req, res) => {
    res.send('Server Working');
});
const port=process.env.PORT;

app.listen(port,()=>{
        console.log("server is running successfully");
})