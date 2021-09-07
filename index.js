import http from 'http';
import {Server} from 'socket.io';
import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import errorHandler from './middlewares/errorHandler.js'; //custom error handling

//import routers
import adsRouter from './routes/adsRouter.js';
import adStateRouter from './routes/adStateRouter.js';
import categoryRouter from './routes/categoryRouter.js';
import citiesRouter from './routes/citiesRouter.js';
import favAdsRouter from './routes/favAdsRouter.js'
import favUserRouter from './routes/favUserRouter.js';
import messagesRouter from './routes/messagesRouter.js';
import storesRouter from './routes/storesRouter.js';
import subCategoryRouter from './routes/subCategoryRouter.js';
import tagsRouter from './routes/tagsRouter.js';
import userRatingsRouter from './routes/userRatingsRouter.js';
import userRouter from './routes/userRouter.js';
import userTypeRouter from './routes/userTypeRouter.js';
import searchRouter from './routes/searchRouter.js';
import imgUploadRouter from './routes/imgUploadRouter.js';
import {verifyUserSocketIO} from './middlewares/verifyUser.js';
import { createChatMessage,getMessagesFromOneChat } from './controllers/chatMessages.js';
import chatRouter from './routes/chatRouter.js';

const app=express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server,{
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ["GET", "POST"]
    }});


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, 'public')));

/* if (process.env.NODE_ENV !== 'production') {
    const morgan = await import('morgan');
    app.use(morgan.default('dev'));
}; */

app.use(cors({origin: process.env.CORS_ORIGIN}));

app.use(express.json());
// app.use(express.static(join(__dirname, 'public')));

app.use('/users',userRouter);
app.use('/rate',userRatingsRouter);
app.use('/ads',adsRouter);
app.use('/adstates',adStateRouter);
app.use('/cities',citiesRouter);
app.use('/messages',messagesRouter);
app.use('/stores',storesRouter);
app.use('/tags',tagsRouter);
app.use('/favads',favAdsRouter);
app.use('/favusers',favUserRouter);
app.use('/categories',categoryRouter);
app.use('/subcategories',subCategoryRouter);
app.use('/usertypes',userTypeRouter);
app.use('/search',searchRouter);
app.use('/image-upload',imgUploadRouter);
app.use('/chats',chatRouter);
app.use(errorHandler);
app.all('*',(req,res)=>res.status(404).json({error:'Not found'}));

//app.listen(port,()=>console.log(`Server is listening port ${port}`));

// socket.onAny((event, ...args) => {
//     console.log(event, args);
//   });

const connectedUsers = {};
io.use(verifyUserSocketIO);
io.on('connection', (socket) => {
    connectedUsers[socket.id] = socket.userData.userId;
    console.log('a user connected',socket.userData,socket.id);

    //if other sessions of the same user exist:
    for (let sock of io.of("/").sockets) {
        if((sock[1].userData.userId===socket.userData.userId) && (sock[0]!==socket.id)){
           console.log('found sock',sock[0]);
           console.log(io.sockets.sockets[sock[0]]);
           //console.log('rooms',sock);
           //io.sockets[sock[0]].disconnect();
           console.log('disconnecting',sock[0]);
        }
    } 
    socket.on('newChatMessage', async (data) => {
        //console.log('------------------',io.of("/").sockets);
        // socket.to(to).emit("private message", {
        //     content,
        //     from: socket.id,
        //   });
        // const users = [];
        if(socket.userData.userId===data.toUser){
            console.log("You're trying to send a message to yourself.");
            return socket.emit('error',"You're trying to send a message to yourself.");
        }
        const msgTimeStamp = new Date(Date.now());
        let isDelivered=false;
        const msg = {
            message: data.message,
            senderName: socket.userData.userName,
            sender:socket.userData.userId,
            msgTimeStamp:msgTimeStamp,
        };
        for (let socket1 of io.of("/").sockets) {
            if(socket1[1].userData.userId===data.toUser){
                console.log('found userId',socket1[1].userData.userId,'=',data.toUser);

                socket.to(socket1[0]).emit("newChatMessage", msg);
                console.log('USER:',socket1[1].userData.userId,'ID=',socket1[0]);
                isDelivered=true;
               // socket.emit("newChatMessage", msg);
                break;
            }
        //   users.push({
        //     userID: id,
        //     username: socket,
        //   });
        
        };
        const msgToDB = await createChatMessage(socket.userData.userId,data.toUser,data.message,msgTimeStamp,isDelivered);
        
        socket.emit("newChatMessage", msg);
        // socket.emit("users", users);

        // console.log(data.toUser);
        // console.log('msg:',data.message);
        //io.to('some room').emit('some event');
    });
    socket.on('getMessagesFromOneChat', async (fromUserId) => {
        console.log('myId=',socket.userData.userId,'secondId',fromUserId);
        const msgList = await getMessagesFromOneChat(socket.userData.userId,fromUserId);
        socket.emit('messagesFromChat',msgList);
        console.log('user disconnected');
    });
    socket.on('disconnect', () => {
        console.log('user disconnected ',socket.userData.userId);
        delete connectedUsers[socket.id];
    });
});

  
server.listen(port)