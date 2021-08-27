import { Router } from "express";
import { searchAds,plzOrCityFinder } from '../controllers/search.js';

const searchRouter = Router();

searchRouter.post('/', searchAds);
searchRouter.post('/plzorcity', plzOrCityFinder);

export default searchRouter;