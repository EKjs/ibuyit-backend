import { Router } from "express";
import { getAllCategories, getOneCategory, createCategory, updateCategory, deleteCategory } from '../controllers/categories.js';

const categoryRouter = Router();

categoryRouter.get('/', getAllCategories); //?skip=0&limit=10
categoryRouter.get('/:id', getOneCategory);
categoryRouter.post('/', createCategory); //add admin's middleware
categoryRouter.put('/:id', updateCategory); //add admin's middleware
categoryRouter.delete('/:id', deleteCategory); //add admin's middleware

export default categoryRouter;