import { Router } from "express";
import { getAllAds, getNewAds, getAdsByUserId, getOneAd, createAd, updateAd, deleteAd,getAdsByCatId,getAdsBySubCatId,getAdsByCityId } from '../controllers/ads.js';
import verifyUser from "../middlewares/verifyUser.js";

const adsRouter = Router();

adsRouter.get('/', getAllAds); //?skip=0&limit=10
adsRouter.get('/new/:count', getNewAds);
adsRouter.get('/byuser/:userId', getAdsByUserId);

adsRouter.get('/bycategory/:catId', getAdsByCatId);
adsRouter.get('/bysubcategory/:subCatId', getAdsBySubCatId);
adsRouter.get('/bycity/:cityId', getAdsByCityId);


adsRouter.get('/:id', getOneAd);
adsRouter.post('/', verifyUser, createAd);
adsRouter.put('/:id', verifyUser, updateAd);
adsRouter.delete('/:id', verifyUser, deleteAd);

export default adsRouter;