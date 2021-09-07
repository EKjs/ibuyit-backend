import { Router } from "express";
import verifyUser from "../middlewares/verifyUser.js";
import { getMyChats,getMyUnread } from '../controllers/chatMessages.js';

const chatRouter = Router();

chatRouter.get('/mychats', verifyUser,getMyChats); //?skip=0&limit=10
chatRouter.get('/myunread', verifyUser,getMyUnread); //?skip=0&limit=10
/* chatRouter.get('/:id', getOneAd);
chatRouter.post('/', createAd);
chatRouter.put('/:id', updateAd);
chatRouter.delete('/:id', deleteAd);
 */
export default chatRouter;