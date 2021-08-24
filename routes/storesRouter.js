import { Router } from "express";
import { getAllStores, getOneStore, createStore, updateStore, deleteStore } from '../controllers/stores.js';

const storesRouter = Router();

storesRouter.get('/', getAllStores); //?skip=0&limit=10
storesRouter.get('/:id', getOneStore);
storesRouter.post('/', createStore); //add admin's middleware
storesRouter.put('/:id', updateStore); //add admin's middleware
storesRouter.delete('/:id', deleteStore); //add admin's middleware

export default storesRouter;