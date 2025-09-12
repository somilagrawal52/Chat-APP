const Message = require("../models/messages");
const User = require("../models/user");
const cloudinary=require("../lib/cloudinary");
const {io,userSocketMap}=require("../server");

async function getallusersforsidebar(req,res) {
    try {
        const userId=req.user._id;
        const filteredusers = await User.find({_id:{$ne:userId}}).select("-password");

        const unseenMessagesCount={};
        const promises=filteredusers.map(async (user)=>{
            const unseenMessages=await Message.find({sender:user._id,receiver:userId,seen:false});
            if(unseenMessages.length>0){
                unseenMessagesCount[user._id]=unseenMessages.length;
            }
        });
        await Promise.all(promises);
        res.status(200).json({success: true, users: filteredusers, unseenMessagesCount });
    } catch (error) {
        console.error("Error fetching users for sidebar:", error);
        res.status(500).json({ message: error.message });
    }
}

async function getmessages(req,res) {
    try {
        const {id:selectedUserId}=req.params;
        const myId=req.user._id;

        const messages=await Message.find({$or:[
            {sender:myId,receiver:selectedUserId},
            {sender:selectedUserId,receiver:myId}
        ]}).sort({createdAt:1});

        await Message.updateMany({sender:selectedUserId,receiver:myId},{seen:true});

        res.json({success:true,messages});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
}

async function markseen(req,res) {
    try {
        const {id}=req.params;

        await Message.findByIdAndUpdate(id,{seen:true});
        res.json({success:true,message:"Message marked as seen"});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
}

async function sendMessage(req,res) {
    try {
        const {text,image}=req.body;
        const receiverId=req.params.id;
        const senderId=req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }

        const newMessage= await Message.create({
            text,
            image:imageUrl,
            sender:senderId,
            receiver:receiverId
        });

        //emit the new message to receiver's socket
        const receiverSocketId=userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.status(201).json({success:true,newMessage});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
}

module.exports={getallusersforsidebar,getmessages,markseen,sendMessage};