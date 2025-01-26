import { Server} from "socket.io";
import {createServer} from 'http';
import express from 'express';
import { Socket } from "dgram";
const app = express();

const server = createServer(app);

const io = new Server(server,{
    cors:{
        origin: "http://localhost:5173",
        methods:['Get','Post'],
        credentials:true
    }
});


export function getReciverSoketId(userId){
    return userSocketMap[userId];
}

const userSocketMap = {};

io.on('connection', (socket) => {
    // console.log("User is connected: ", socket.id);
    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id;
    }
    socket.on('userConnected', (userData) => {
        socket.join(userData._id);
        // console.log(`User joined room: ${userData._id}`)
        socket.emit('connected', { message: 'You are now connected!' });
    });
    // socket.on('join chat',(room)=>{
    //     socket.join(room);
    //     console.log('user join: ' + room);
    // })
    socket.on('disconnect', () => {
        // console.log("User disconnected:", socket.id);
        delete userSocketMap[userId];
    });
});




export {app,server,io};