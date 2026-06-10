const{updateProfile,registerUser,login}=require('../controllers/user.controller');
const express=require('express');
const router=express.Router();
const isAuthenticated=require('../middleware/auth');
router.post('/register',registerUser);
router.post('/login',login);
router.put('/profile/update', isAuthenticated, updateProfile);
module.exports=router;