import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import connectdb from './utils/init.js';
import userRoute from './route/user.route.js';
import messageRoute from './route/message.route.js';
import cors from 'cors';
import { app,server,io } from './utils/socket.js';
// const app = express();
dotenv.config();
const Port = process.env.PORT || 3000;
let corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extendes: true}));
app.use('/user', userRoute);
app.use('/message', messageRoute);
app.get('/', (req,res)=>{
    res.send("hello you are on right");
})

// app.get('/hello',(req,res)=>{
//     res.send("heallo"); 
// })
server.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
    connectdb();
});