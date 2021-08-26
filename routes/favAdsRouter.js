import { Router } from "express";
import { getAllFavAds, getFavAdsOfUser, addFavAd, updateFavAd, deleteFavAd, getOneFavAd } from '../controllers/favAds.js';
import verifyUser from "../middlewares/verifyUser.js";

const favAdsRouter = Router();

favAdsRouter.get('/', verifyUser, getAllFavAds); //?skip=0&limit=10
favAdsRouter.get('/myfav', verifyUser, getFavAdsOfUser);
favAdsRouter.get('/:id', verifyUser, getOneFavAd);

//TODO ! favAdsRouter.get('/:id/ads', getUsersAds);
favAdsRouter.post('/',verifyUser, addFavAd); 
favAdsRouter.put('/:id', verifyUser, updateFavAd);
favAdsRouter.delete('/:id', verifyUser, deleteFavAd);

export default favAdsRouter;