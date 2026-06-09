const{updateProfile,registerUser,login}=require('../controllers/user.controller');
const express=require('express');
const router=express.Router();
router.post('/register',registerUser);
router.post('/login',login);
router.put('/profile/update',updateProfile);
module.exports=router;