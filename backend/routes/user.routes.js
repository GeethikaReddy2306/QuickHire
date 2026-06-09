const{updateProfile,registerUser,login}=require('../controllers/user.controller');
const express=require('express');
const router=express.Router();
const isAuthorized=require('../middleware/auth');
router.post('/register',registerUser);
router.post('/login',login);
router.put('/profile/update', isAuthorized, updateProfile);
module.exports=router;