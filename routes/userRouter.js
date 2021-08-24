import { Router } from "express";
import { getAllUsers, getOneUser, createUser, updateUser, deleteUser } from '../controllers/users.js';

const userRouter = Router();

userRouter.get('/', getAllUsers); //?skip=0&limit=10
userRouter.get('/:id', getOneUser);
userRouter.post('/', createUser); //add admin's middleware
userRouter.put('/:id', updateUser); //add admin's middleware
userRouter.delete('/:id', deleteUser); //add admin's middleware

export default userRouter;