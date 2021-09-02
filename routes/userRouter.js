import { Router } from "express";
import { getAllUsers, getOneUser, createUser, updateUser, deleteUser, signIn } from '../controllers/users.js';
import verifyUser from "../middlewares/verifyUser.js";

const userRouter = Router();

userRouter.post('/signin',signIn);
userRouter.get('/', verifyUser, getAllUsers); //?skip=0&limit=10
userRouter.get('/:id',verifyUser, getOneUser);
//TODO ! userRouter.get('/:id/ads', getUsersAds);
userRouter.post('/', createUser); 
userRouter.put('/:id', verifyUser, updateUser);
userRouter.delete('/:id', verifyUser, deleteUser);

export default userRouter;