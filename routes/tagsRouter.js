import { Router } from "express";
import { getAllTags, getOneTag, createTag, updateTag, deleteTag } from '../controllers/tags.js';

const tagsRouter = Router();

tagsRouter.get('/', getAllTags); //?skip=0&limit=10
tagsRouter.get('/:id', getOneTag);
tagsRouter.post('/', createTag); //add admin's middleware
tagsRouter.put('/:id', updateTag); //add admin's middleware
tagsRouter.delete('/:id', deleteTag); //add admin's middleware

export default tagsRouter;