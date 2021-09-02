import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import errorHandler from './middlewares/errorHandler.js'; //custom error handling

//import routers
import adsRouter from './routes/adsRouter.js';
import adStateRouter from './routes/adStateRouter.js';
import categoryRouter from './routes/categoryRouter.js';
import citiesRouter from './routes/citiesRouter.js';
import favAdsRouter from './routes/favAdsRouter.js'
import favUserRouter from './routes/favUserRouter.js';
import messagesRouter from './routes/messagesRouter.js';
import storesRouter from './routes/storesRouter.js';
import subCategoryRouter from './routes/subCategoryRouter.js';
import tagsRouter from './routes/tagsRouter.js';
import userRatingsRouter from './routes/userRatingsRouter.js';
import userRouter from './routes/userRouter.js';
import userTypeRouter from './routes/userTypeRouter.js';
import searchRouter from './routes/searchRouter.js';
import imgUploadRouter from './routes/imgUploadRouter.js';

const app=express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, 'public')));

if (process.env.NODE_ENV !== 'production') {
    const morgan = await import('morgan');
    app.use(morgan.default('dev'));
};

app.use(cors({origin: process.env.CORS_ORIGIN}));

app.use(express.json());
// app.use(express.static(join(__dirname, 'public')));

app.use('/users',userRouter);
app.use('/rate',userRatingsRouter);
app.use('/ads',adsRouter);
app.use('/adstates',adStateRouter);
app.use('/cities',citiesRouter);
app.use('/messages',messagesRouter);
app.use('/stores',storesRouter);
app.use('/tags',tagsRouter);
app.use('/favads',favAdsRouter);
app.use('/favusers',favUserRouter);
app.use('/categories',categoryRouter);
app.use('/subcategories',subCategoryRouter);
app.use('/usertypes',userTypeRouter);
app.use('/search',searchRouter);
app.use('/image-upload',imgUploadRouter);

app.all('*',(req,res)=>res.status(404).json({error:'Not found'}));
app.use(errorHandler);
app.listen(port,()=>console.log(`Server is listening port ${port}`));