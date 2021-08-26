import { Router } from "express";
import { getAllCategories, getOneCategory, createCategory, updateCategory, deleteCategory } from '../controllers/categories.js';
import verifyUser from "../middlewares/verifyUser.js";

const categoryRouter = Router();

categoryRouter.get('/', getAllCategories); //?skip=0&limit=10
categoryRouter.get('/:id', getOneCategory);
categoryRouter.post('/', verifyUser, createCategory); //add admin's middleware
categoryRouter.put('/:id', verifyUser, updateCategory); //add admin's middleware
categoryRouter.delete('/:id', verifyUser, deleteCategory); //add admin's middleware

export default categoryRouter;