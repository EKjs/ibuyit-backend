import { Router } from "express";
import { getAllFavUsers, getOneFavUser, getFavUsersOfUser, addFavUser, updateFavUser, deleteFavUser } from '../controllers/favUsers.js';
import verifyUser from "../middlewares/verifyUser.js";

const favUserRouter = Router();

favUserRouter.get('/', verifyUser, getAllFavUsers); //?skip=0&limit=10
favUserRouter.get('/myfav', verifyUser, getFavUsersOfUser);
favUserRouter.get('/:id', verifyUser, getOneFavUser);

//TODO ! favUserRouter.get('/:id/ads', getUsersAds);
favUserRouter.post('/',verifyUser, addFavUser); 
favUserRouter.put('/:id', verifyUser, updateFavUser);
favUserRouter.delete('/:id', verifyUser, deleteFavUser);

export default favUserRouter;