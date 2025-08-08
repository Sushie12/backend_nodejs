const Vendor=require('../models/Vendor');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const dotEnv=require('dotenv');

dotEnv.config();
const secretKey=process.env.WhatIsYourName;



const vendorRegister=async(req,res)=>{
    console.log("Request body:", req.body);
    const {username,email,password}=req.body
    try{
        const vendorEmail=await Vendor.findOne({email});
        if(vendorEmail){
            return res.status(400).json("EMail already exist")
        }
        const hashedPassword=await bcrypt.hash(password,10);

        const newVendor=new Vendor({
            username,
            email,
            password:hashedPassword
        });
        await newVendor.save();

        res.status(201).json({message:"VEndore registered succuessfully"});
        console.log('registered');



    }catch(error){
        console.error(error);
        res.status(500).json({error:"Internal server error"});

    }
}


const vendorLogin=async(req,res)=>{
    const {email,password}=req.body;
try{
    const vendor=await Vendor.findOne({email});
    if(!vendor || !(await bcrypt.compare(password,vendor.password))){
        return res.status(401).json({error:"Invalid username or password"})
    }
    const token=jwt.sign({vendorId:vendor._id},secretKey,{expiresIn:"1h"})


    res.status(200).json({success:"Login successful",token})
    console.log(email,"this is a token",token);
}catch(error){
    console.log(error);
    res.status(500).json({error:"Internal server error"});

}
}

const getAllVendors=async(req,res)=>{
    console.log("getAllVendors function called");
    try{
        const vendors=await Vendor.find();
        console.log("Vendors found:", vendors.length);
        res.json({vendors})

    }catch(error){
        console.log("Error in getAllVendors:", error);
        res.status(500).json({error:"Internal server error"});
    }
}


const getVendorById=async(req,res)=>{
    const vendorId=req.params.id;

    try{
        const vendor=await Vendor.findById(vendorId);
        if(!vendor){
            return res.status(404).json({error:"Vendor not found "});

        }
        res.status(200).json({vendor});
    }catch(error){
        console.log(error);
        res.status(500).json({error:"Internal server error"});
    }
}


module.exports={vendorRegister,vendorLogin,getAllVendors,getVendorById}