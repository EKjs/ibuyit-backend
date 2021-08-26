import { Router } from "express";
import { getAllSubCategories, getOneSubCategory, createSubCategory, updateSubCategory, deleteSubCategory } from '../controllers/subCategories.js';
import verifyUser from "../middlewares/verifyUser.js";

const subCategoryRouter = Router();

subCategoryRouter.get('/', getAllSubCategories); //?skip=0&limit=10
subCategoryRouter.get('/:id', getOneSubCategory);
subCategoryRouter.post('/', verifyUser, createSubCategory); //add admin's middleware
subCategoryRouter.put('/:id', verifyUser, updateSubCategory); //add admin's middleware
subCategoryRouter.delete('/:id', verifyUser, deleteSubCategory); //add admin's middleware

export default subCategoryRouter;