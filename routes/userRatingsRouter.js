import { Router } from "express";
import { getAvgRatingOfUser, createUserRating, getUsersRatings } from '../controllers/userRatings.js';
import verifyUser from "../middlewares/verifyUser.js";

const userRatingsRouter = Router();

//userRatingsRouter.get('/', getAllUserRatings); //?skip=0&limit=10
userRatingsRouter.get('/:id/rating', getAvgRatingOfUser); //get AVG of my ratings
userRatingsRouter.get('/:id', verifyUser, getUsersRatings); //How I rated other users
userRatingsRouter.post('/', verifyUser, createUserRating); //check for userID in TOKEN and get it to post
//userRatingsRouter.put('/:id', updateUserRating); //add admin's middleware
//userRatingsRouter.delete('/:id', deleteUserRating); //add admin's middleware

export default userRatingsRouter;