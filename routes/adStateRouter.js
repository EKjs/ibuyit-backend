import { Router } from "express";
import { getAllAdStates, getOneAdState, createAdState, updateAdState, deleteAdState } from '../controllers/adState.js';
import verifyUser from "../middlewares/verifyUser.js";
const adStateRouter = Router();

adStateRouter.get('/', getAllAdStates); //?skip=0&limit=10
adStateRouter.get('/:id', getOneAdState);
adStateRouter.post('/',verifyUser, createAdState);
adStateRouter.put('/:id',verifyUser, updateAdState);
adStateRouter.delete('/:id',verifyUser, deleteAdState);

export default adStateRouter;