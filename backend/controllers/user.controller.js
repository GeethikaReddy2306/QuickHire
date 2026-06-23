const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken');
const User = require("../models/user.model");
async function registerUser(req,res){
        const{name,email,phoneNumber,password,role}=req.body;
        try{
                if(!name||!email||!phoneNumber||!password||!role){
              return  res.status(400).json({
                        message:'Missing required fields'
                });
        }
                const checkMail=await User.findOne({email})
                if(checkMail){
                      return  res.status(409).json({
                                message:'User already exists'
                        });
                }
                
const hashedPassword= await bcrypt.hash(password,10);
await User.create({name,email,phoneNumber,password:hashedPassword,role});
return res.status(201).json({
        message: 'Registration successful'
})
                

        
        }catch(err){
                console.log(err);
             return  res.status(500).json({
                        message:"somthing went wrong"
                })
        }
}
async function login(req,res){
        try{
      const{email,password,role}=req.body;
      
      if(!email||!password||!role){
              return  res.status(400).json({
                        message:'Missing required fields'
                });
        }
const alreadylogin= await User.findOne({email});
      if(!alreadylogin){
       return res.status(400).json({
               message:"Incorrect email or password"
        });
      }  
      const isMatch=await bcrypt.compare(password,alreadylogin.password);
      if(!isMatch){
       return res.status(401).json({
                message:"invalid password"
        })
      }
      if(role!==alreadylogin.role){
        return res.status(400).json({
                message:"Account doesn't match with current role",
                success:false
        })
      }
      const token = jwt.sign(
    {
        userId: alreadylogin._id,
        role: alreadylogin.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
);
    return res.status(200)
.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000
})
.json({
    message: "Login successful",
    success: true,
    user: {
        _id: alreadylogin._id,
        name: alreadylogin.name,
        email: alreadylogin.email,
        phoneNumber: alreadylogin.phoneNumber,
        role: alreadylogin.role,
        profile: alreadylogin.profile
    }
});

        }catch(err){
                console.log(err);
             return  res.status(500).json({
                        message:"somthing went wrong"
                })
        }
        

}
async function updateProfile(req, res) {
    try {
        const { name, email, phoneNumber, bio, skills } = req.body;

        if (!name || !email || !phoneNumber || !bio || !skills) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

       const skillsArray = skills
  .split(",")
  .map((skill) => skill.trim())
  .filter((skill) => skill !== "");

        const userId = req.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        user.name = name;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.profile.bio = bio;
        user.profile.skills = skillsArray;

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}
        module.exports={updateProfile,registerUser,login};