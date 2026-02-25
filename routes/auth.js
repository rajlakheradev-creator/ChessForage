const express=require("express");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const user=require("../js/user.js");

const router =express.Router();
router.post("/signup",async(req,res)=>{
    const{name,email,password}=req.body;
    const existingUser = await user.findOne({email});
    if(existingUser) return res.status(400).json({message:"user already exists"});

    const hashedpassword=await bcrypt.hash(password,10);

    const user=new User({
        name,
        email,
        password:hashedpassword
    });
    await user.save();
res.json({message:"user created successfully"});
});
    router.post("/login",async(req,res)=>{
        const user=await User.findOne({email});
        if(!user) return res.statusCode(400).json({message:"invalid credentials"});

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch)    return res.statusCode(400).json({message:"invalid credentials"});

        const token=jwt.sign({
            id:user._id
        },
    process.env.JWT_SECRET,
{expiresIn:"7d"}
);
res.json({token});
    });
module.exports=router;