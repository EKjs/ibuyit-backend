import { Router } from "express";
import { getAllStores, getOneStore, createStore, updateStore, deleteStore } from '../controllers/stores.js';
import verifyUser from "../middlewares/verifyUser.js";

const storesRouter = Router();

storesRouter.get('/', getAllStores); //?skip=0&limit=10
storesRouter.get('/:id', getOneStore);
storesRouter.post('/', verifyUser, createStore); //add admin's middleware
storesRouter.put('/:id', verifyUser, updateStore); //add admin's middleware
storesRouter.delete('/:id', verifyUser, deleteStore); //add admin's middleware

export default storesRouter;