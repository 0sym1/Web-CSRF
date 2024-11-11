const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const port = 3000;
const app = express();

app.use(express.static("."));
const server =http.createServer(app);
// const io = socketIo(server);
const io = socketIo(server, {
    cors: {
        origin: "*",  // Cho phép tất cả các nguồn gốc, hoặc bạn có thể đặt thành tên miền cụ thể như 'https://battle-sore-jasmine.glitch.me'
        methods: ["GET", "POST"]
    }
});

io.on("connection",socket =>{
    console.log("User Connected");

    socket.on("newStatus",function(data){
        io.emit("newStatus",data);
    });
    socket.on("disconnect",()=>{
        console.log("User Disconnected");
    });

});

server.listen(port,()=>console.log(`Listening on port ${port}`));




