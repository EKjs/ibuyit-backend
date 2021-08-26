import { Router } from "express";
import { getAllCities, getOneCity, createCity, updateCity, deleteCity } from '../controllers/cities.js';
import verifyUser from "../middlewares/verifyUser.js";
const citiesRouter = Router();

citiesRouter.get('/', getAllCities); //?skip=0&limit=10
citiesRouter.get('/:id', getOneCity);
citiesRouter.post('/',verifyUser, createCity); 
citiesRouter.put('/:id',verifyUser, updateCity);
citiesRouter.delete('/:id',verifyUser, deleteCity);

export default citiesRouter;