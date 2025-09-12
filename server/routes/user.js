const express=require("express");
const router=express.Router();
const User=require("../models/user");
const {userSignup,userSignin,updateprofile}=require("../controllers/user");
const {checkforAuthentication}=require("../middleware/auth");

router.post("/signup",userSignup);
router.post("/signin",userSignin);
router.put("/update",checkforAuthentication,updateprofile);

module.exports=router;