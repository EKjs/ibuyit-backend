import { Router } from "express";
import { getAllUserTypes, getOneUserType, createUserType, updateUserType, deleteUserType } from '../controllers/userTypes.js';
import verifyUser from "../middlewares/verifyUser.js";

const userTypeRouter = Router();

userTypeRouter.get('/', verifyUser, getAllUserTypes); //?skip=0&limit=10
userTypeRouter.get('/:id', verifyUser, getOneUserType);
userTypeRouter.post('/', verifyUser, createUserType); //add admin's middleware
userTypeRouter.put('/:id', verifyUser, updateUserType); //add admin's middleware
userTypeRouter.delete('/:id', verifyUser, deleteUserType); //add admin's middleware

export default userTypeRouter;