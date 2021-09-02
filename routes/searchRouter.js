import { Router } from "express";
import { searchAds,plzOrCityFinder,searchAdsV2 } from '../controllers/search.js';

const searchRouter = Router();

searchRouter.post('/v2/', searchAdsV2);
searchRouter.post('/plzorcity', plzOrCityFinder);
searchRouter.post('/', searchAds);

export default searchRouter;