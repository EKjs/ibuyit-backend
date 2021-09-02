// import { dirname, join } from 'path';
// import { fileURLToPath } from 'url';
//import { resolve } from 'path';
// import { resolve, extname } from 'path';
//import fs from 'fs';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const tempFolder = resolve('public', 'temp');
// const uploadFolder = resolve('public', 'images');

// export const moveFilesToImagesFolder = async (fileArray) => {
//     fileArray.forEach(async file => {
//         const fromP = tempFolder + `/`+file;
//         const toP = uploadFolder+`/`+file;
//         console.log('from',fromP);
//         console.log('to',toP);
//         const renResult = await fs.promises.rename(fromP,toP);
//     });
    /* import { rename } from 'fs';

rename('oldFile.txt', 'newFile.txt', (err) => {
  if (err) throw err;
  console.log('Rename complete!');
}); */
//console.log(uploadFolder);
//const renResult = await fs.promises.rename()
//  }

/* export const deleteTempImage = async (fileName) => {
  const fromP = tempFolder + `/`+fileName;
  return fs.promises.unlink(fromP)
}

export const deleteImage = async (fileName) => {
  const fromP = uploadFolder + `/`+fileName;
  return fs.promises.unlink(fromP)
} */