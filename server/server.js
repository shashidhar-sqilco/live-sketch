import express from 'express'
import{createServer} from 'http';
import {Server} from 'socket.io';


const app=express();
const server=createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  },
});

const PORT=5000;

const drawingHistory=[];
io.on("connection",(socket)=>{
    console.log("a new client connected");
    socket.emit("drawingHistory",drawingHistory);

    socket.on("draw",(data)=>{
        drawingHistory.push(data);
        socket.broadcast.emit('draw',data);
    })

    socket.on('clear',()=>{
        drawingHistory.length=0;
        io.emit('clear');
    })

    socket.on("disconnect",()=>{
        console.log("Client disconnected");
    });

})

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})