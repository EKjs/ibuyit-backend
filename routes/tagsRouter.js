import { Router } from "express";
import { getAllTags, getOneTag, createTag, updateTag, deleteTag } from '../controllers/tags.js';
import verifyUser from "../middlewares/verifyUser.js";
const tagsRouter = Router();

tagsRouter.get('/', getAllTags); //?skip=0&limit=10
tagsRouter.get('/:id', getOneTag);
//tagsRouter.post('/addtagsto', verifyUser, createTag); //add admin's middleware 
tagsRouter.post('/', verifyUser, createTag); //add admin's middleware
tagsRouter.put('/:id', verifyUser, updateTag); //add admin's middleware
tagsRouter.delete('/:id', verifyUser, deleteTag); //add admin's middleware

export default tagsRouter;