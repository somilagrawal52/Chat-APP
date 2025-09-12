const {getallusersforsidebar,getmessages,markseen,sendMessage}=require("../controllers/messages");
const express=require("express");
const router=express.Router();
const {checkforAuthentication}=require("../middleware/auth");

router.get("/users",checkforAuthentication,getallusersforsidebar);
router.get("/messages/:id",checkforAuthentication,getmessages);
router.put("/messages/seen/:id",checkforAuthentication,markseen);
router.post("/send/:id",checkforAuthentication,sendMessage);

module.exports=router;