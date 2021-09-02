import { Router } from "express";
import { upload } from '../utils/multerUploader.js';
import {uploadImages,fileUploaderMW,deleteImage} from '../controllers/imgUploader.js';
import verifyUser from "../middlewares/verifyUser.js";

const imgUploadRouter = Router();

imgUploadRouter.post('/',verifyUser,upload.array('image',10),fileUploaderMW,uploadImages);
imgUploadRouter.delete('/:id',verifyUser,deleteImage);
//imgUploadRouter.delete('/editor/:id',verifyUser,deleteImageFromImages);

export default imgUploadRouter

