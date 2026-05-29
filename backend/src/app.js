const express=require('express');
const app=express();
app.use(express.json());
const db=require('./config/db');
const cors=require('cors');
const morgan=require('morgan');
