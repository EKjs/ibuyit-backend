import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import { resolve } from 'path';
import fs from 'fs';

const uploadFolder = resolve('public', 'images');

export const uploadImages = asyncHandler(async (req, res) => {
    console.log(req.files);
    // const { protocol } = req;
    // const host = req.get('host'); 
    const resp = req.files.map(file=>{
        // return {path:`${protocol}://${host}/temp/${file.filename}`,filename:file.filename}
        return file.filename
    })
    res.status(201).json(resp);
});

export const fileUploaderMW = (req,res,next)=>{
    if (req.files.length<1)throw new ErrorResponse('No files were chosen.');
    next();
}


export const deleteImage = asyncHandler(async (req, res) => {
    const fromP = uploadFolder + `/`+req.params.id;
    const deleteOk = await fs.promises.unlink(fromP);
    deleteOk === undefined ? res.status(201).json(req.params.id) : res.status(200).json(deleteOk);
});


// export const deleteImageFromTemp = asyncHandler(async (req, res) => {
//     const deleteOk = await deleteTempImage(req.params.id);
//     deleteOk === undefined ? res.status(201).json(req.params.id) : res.status(200).json(deleteOk);
// });
