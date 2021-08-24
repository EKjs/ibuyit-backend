import { Router } from "express";
import { getAllAds, getOneAd, createAd, updateAd, deleteAd } from '../controllers/administration.js';

const adminRouter = Router();

adminRouter.get('/', getAllAds); //?skip=0&limit=10
adminRouter.get('/:id', getOneAd);
adminRouter.post('/', createAd);
adminRouter.put('/:id', updateAd);
adminRouter.delete('/:id', deleteAd);

export default adminRouter;