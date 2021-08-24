import { Router } from "express";
import { getAllAds, getOneAd, createAd, updateAd, deleteAd } from '../controllers/ads.js';

const adsRouter = Router();

adsRouter.get('/', getAllAds); //?skip=0&limit=10
adsRouter.get('/:id', getOneAd);
adsRouter.post('/', createAd);
adsRouter.put('/:id', updateAd);
adsRouter.delete('/:id', deleteAd);

export default adsRouter;