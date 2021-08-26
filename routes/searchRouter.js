import { Router } from "express";
import { searchAds } from '../controllers/search.js';

const searchRouter = Router();

searchRouter.post('/', searchAds);

export default searchRouter;