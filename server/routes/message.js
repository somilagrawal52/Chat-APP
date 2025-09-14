const {getallusersforsidebar,getmessages,markseen,sendMessage,generativeaireplies}=require("../controllers/messages");
const express=require("express");
const router=express.Router();
const {checkforAuthentication}=require("../middleware/auth");

router.get("/users",checkforAuthentication,getallusersforsidebar);
router.get("/messages/:id",checkforAuthentication,getmessages);
router.put("/messages/seen/:id",checkforAuthentication,markseen);
router.post("/send/:id",checkforAuthentication,sendMessage);
router.post("/smart-replies",generativeaireplies);

module.exports=router;