const {getCompany,registerCompany,updateCompany,getCompanyId}=require('../controllers/company.controller');
const express=require('express');
const router=express.Router();
const isAuthorized=require('../middleware/auth');
router.post('/register',isAuthorized,registerCompany);
router.get('/get',isAuthorized,getCompany);
router.get('/get/:id',isAuthorized,getCompanyId);
router.patch('/update/:id',isAuthorized,updateCompany);
module.exports=router;