const {createToken} = require("../services/service");
const User = require("../models/user");
const cloudinary = require("../lib/cloudinary");

async function userSignup(req,res) {
    const { username, email, password, bio } = req.body;
    try {
        if(!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if(typeof password !== 'string') {
            return res.status(400).json({ message: "Password must be a string" });
        }
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create new user 
      const newUser = await User.create({ username, email, password, bio });

      const token = createToken(newUser);

      res.status(201).json({success:true, user:newUser, token, message: "User created successfully" });
    } catch (error) {
      console.error("Error during user signup:", error);
      res.status(500).json({ message: "Internal server error" });
    }
}

async function userSignin(req,res) {
    const {email,password}=req.body;
    try {
        const user = await User.matchpassword(email,password);
        const token = createToken(user);
        res.status(200).json({success:true, user, token, message:"Login Successful"});
    } catch (error) {
        console.error("Error during user signin:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function updateprofile(req,res) {
    try {
        const { username, bio, profilePic } = req.body;
        const userId = req.user.id;

        let update;

        if(!profilePic){
            update=await User.findByIdAndUpdate(userId, { username, bio }, { new: true });
        }
        else{
            const upload=await cloudinary.uploader.upload(profilePic,{folder:"profilePics"});
            update=await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,username,bio},{new:true});
        }
        res.json({success:true, user:update, message:"Profile updated successfully"});
    } catch (error) {
        console.error("Error during profile update:", error);
        res.status(500).json({ message: error.message });
    }
}

module.exports={userSignup,userSignin,updateprofile};