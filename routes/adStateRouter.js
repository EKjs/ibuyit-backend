import { Router } from "express";
import { getAllAdStates, getOneAdState, createAdState, updateAdState, deleteAdState } from '../controllers/adState.js';

const adStateRouter = Router();

adStateRouter.get('/', getAllAdStates); //?skip=0&limit=10
adStateRouter.get('/:id', getOneAdState);
adStateRouter.post('/', createAdState); //add admin's middleware
adStateRouter.put('/:id', updateAdState); //add admin's middleware
adStateRouter.delete('/:id', deleteAdState); //add admin's middleware

export default adStateRouter;