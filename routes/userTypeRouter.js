import { Router } from "express";
import { getAllUserTypes, getOneUserType, createUserType, updateUserType, deleteUserType } from '../controllers/userTypes.js';

const userTypeRouter = Router();

userTypeRouter.get('/', getAllUserTypes); //?skip=0&limit=10
userTypeRouter.get('/:id', getOneUserType);
userTypeRouter.post('/', createUserType); //add admin's middleware
userTypeRouter.put('/:id', updateUserType); //add admin's middleware
userTypeRouter.delete('/:id', deleteUserType); //add admin's middleware

export default userTypeRouter;