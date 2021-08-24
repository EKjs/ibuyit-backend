import { Router } from "express";
import { getAllCities, getOneCity, createCity, updateCity, deleteCity } from '../controllers/cities.js';

const citiesRouter = Router();

citiesRouter.get('/', getAllCities); //?skip=0&limit=10
citiesRouter.get('/:id', getOneCity);
citiesRouter.post('/', createCity); //add admin's middleware
citiesRouter.put('/:id', updateCity); //add admin's middleware
citiesRouter.delete('/:id', deleteCity); //add admin's middleware

export default citiesRouter;