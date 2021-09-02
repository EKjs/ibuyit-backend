import multer from 'multer';
import * as mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import { resolve, extname } from 'path';

const uploadFolder = resolve('public', 'images');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadFolder),
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}-${uuidv4()}${extname(file.originalname)}`);
    }
  })

const fileFilter = (req, file, cb) => {
    file.mimetype.startsWith('image') ? cb(null, true) : cb(null, false)
}

export const upload = multer({ storage:storage,fileFilter:fileFilter });