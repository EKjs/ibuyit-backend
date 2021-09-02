import { Router } from "express";
import { getAllMessages, getAllRecievedMessagesOfUser, markMessageAsRead,getAllSentMessagesOfUser, getOneMessage, deleteMessage } from '../controllers/messages.js';
import verifyUser from "../middlewares/verifyUser.js";

const messagesRouter = Router();

messagesRouter.get('/inbox', verifyUser, getAllRecievedMessagesOfUser);
messagesRouter.get('/markread/:id', verifyUser, markMessageAsRead);
messagesRouter.get('/sent', verifyUser, getAllSentMessagesOfUser);
messagesRouter.get('/:id', verifyUser, getOneMessage);
messagesRouter.get('/', verifyUser, getAllMessages); //?skip=0&limit=10, add admin's middleware
/* messagesRouter.post('/', verifyUser, createMessage);
messagesRouter.put('/:id', verifyUser, updateMessage);  */
messagesRouter.delete('/:id', verifyUser, deleteMessage);

export default messagesRouter;