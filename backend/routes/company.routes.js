const {getCompany,registerCompany,updateCompany,getCompanyId}=require('../controllers/company.controller');
const express=require('express');
const router=express.Router();
const isAuthenticated=require('../middleware/auth');
router.post('/register',isAuthenticated,registerCompany);
router.get('/get',isAuthenticated,getCompany);
router.get('/get/:id',isAuthenticated,getCompanyId);
router.patch('/update/:id',isAuthenticated,updateCompany);
module.exports=router;