const {validate}=require('../services/service');
const User=require('../models/user')
async function checkforAuthentication(req,res,next) {
    try {
        const authHeader = req.headers.authorization;
   if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return res.status(401).json({ message: "No token provided" });
   }
   const token = authHeader.split(' ')[1];
   const decoded = validate(token); 
   if (!decoded) {
       return res.status(401).json({ message: "Invalid token" });
   }

   const user=await User.findById(decoded.id).select("-password");
    if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
   req.user = user;
   next();
    } catch (error) {
        console.error("Error during authentication:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    
}
module.exports={checkforAuthentication};