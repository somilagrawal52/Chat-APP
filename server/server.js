const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ quiet: true });
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const {checkforAuthentication} =require('./middleware/auth')
const { Server } = require("socket.io");

//create express app and http server
const app=express();
const server=http.createServer(app);

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
const userSocketMap = {}; //{userid:socketid}

// Initialize socket before requiring routes
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("user connected", userId);

    if (userId) {
        userSocketMap[userId]=socket.id;
    }

    io.emit("getonlineusers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("user disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getonlineusers", Object.keys(userSocketMap));
    });
});

// Export socket instance directly
global.io = io;
global.userSocketMap = userSocketMap;

// Require routes after socket initialization
const userRoute=require("./routes/user");
const messageRoute=require("./routes/message");



mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

//middleware setup
app.use(express.json({limit:'4mb'}));
app.use(cors());

app.get("/status", checkforAuthentication, (req, res) => {
    res.json({ success: true, user: req.user });
});

app.use("/",userRoute);
app.use("/message",messageRoute);

if(process.env.NODE_ENV!=="production"){
const port=process.env.PORT || 5000;
server.listen(port,()=>console.log(`Server running on port ${port}`));
}

//export server for vercel
module.exports=server;