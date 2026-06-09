const express=require('express');
const app=express();
const cookieParser=require('cookie-parser');
const cors=require('cors');
const dotenv=require('dotenv');
const dns=require('dns');
dns.setServers(["1.1.1.1", "8.8.8.8"]);
//to avoid dns error
dotenv.config();
//packages
//connecting db
const db=require('./config/db');

const coresOptions={
        origin:'http://localhost:5173',
        credentials:true
}
app.use(cors(coresOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.listen(process.env.PORT||5000,()=>{
        console.log("server is running successfully");
})