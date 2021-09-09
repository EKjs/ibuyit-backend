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

if (process.env.NODE_ENV !== 'production') {
    const morgan = await import('morgan');
    app.use(morgan.default('dev'));
};

app.use(cors({origin: process.env.CORS_ORIGIN}));

app.use(express.json());

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

const connectedUsers = {};
io.use(verifyUserSocketIO);
io.on('connection', (socket) => {
    if (connectedUsers[socket.userData.userId]){
        return socket.emit('error',"You're already connected!");
    }
    connectedUsers[socket.userData.userId] = socket.id;

    socket.on('newChatMessage', async (data) => {
        if(socket.userData.userId===data.toUser){
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
        if(connectedUsers[data.toUser]){
            socket.to(connectedUsers[data.toUser]).emit("newChatMessage", msg);
            isDelivered=true;
        }
        const msgToDB = await createChatMessage(socket.userData.userId,data.toUser,data.message,msgTimeStamp,isDelivered);
        socket.emit("newChatMessage", msg);
    });

    socket.on('getMessagesFromOneChat', async (fromUserId) => {
        const msgList = await getMessagesFromOneChat(socket.userData.userId,fromUserId);
        socket.emit('messagesFromChat',msgList);
    });

    socket.on('disconnect', () => {
        delete connectedUsers[socket.userData.userId];
        socket.broadcast.emit('callEnded')
    });

    socket.on('callUser', (data) => {
        if(connectedUsers[data.userToCall]){
            socket.to(connectedUsers[data.userToCall]).emit("callUser", {signal:data.signalData});
        }
    });

    socket.on('answerCall', (data) => {
        if(connectedUsers[data.userToAnswer]){
            socket.to(connectedUsers[data.userToAnswer]).emit('callAccepted',data.signal);
        }
    });

    socket.on('endCall', (data) => {
        if(connectedUsers[data.endCallWithUser]){
            socket.to(connectedUsers[data.endCallWithUser]).emit('endCall',data.endCallWithUser);
        }
    });
});
  
server.listen(port)