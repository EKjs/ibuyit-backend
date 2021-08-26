import { Router } from "express";
import { getAllMessages, getAllRecievedMessagesOfUser, getAllSentMessagesOfUser, getOneMessage, createMessage, updateMessage, deleteMessage } from '../controllers/messages.js';
import verifyUser from "../middlewares/verifyUser.js";

const messagesRouter = Router();

messagesRouter.get('/', verifyUser, getAllMessages); //?skip=0&limit=10, add admin's middleware
messagesRouter.get('/:id', verifyUser, getOneMessage);
messagesRouter.get('/inbox', verifyUser, getAllRecievedMessagesOfUser);
messagesRouter.get('/sent', verifyUser, getAllSentMessagesOfUser);
/* messagesRouter.post('/', verifyUser, createMessage);
messagesRouter.put('/:id', verifyUser, updateMessage);  */
messagesRouter.delete('/:id', verifyUser, deleteMessage);

export default messagesRouter;