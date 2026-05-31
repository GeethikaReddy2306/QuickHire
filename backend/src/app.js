const express=require('express');
const app=express();
app.use(express.json());
const db=require('./config/db');
const cors=require('cors');
app.use(cors());
const morgan=require('morgan');
module.exports=app;
