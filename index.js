import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
// import { dirname, join } from 'path';
// import { fileURLToPath } from 'url';

import errorHandler from './middlewares/errorHandler.js'; //custom error handling

//import routers
import userRouter from './routes/userRouter.js';
import authRouter from './routes/authRouter.js';
import userRatingsRouter from './routes/userRatingsRouter.js';
import categoryRouter from './routes/categoryRouter.js';
import subCategoryRouter from './routes/subCategoryRouter.js';
import adsRouter from './routes/adsRouter.js';
import favUserRouter from './routes/favUserRouter.js';
import favAdsRouter from './routes/favAdsRouter.js'

const app=express();
const port = process.env.PORT || 3000;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

if (process.env.NODE_ENV !== 'production') {
    const morgan = await import('morgan');
    app.use(morgan.default('dev'));
};

app.use(cors({origin: process.env.CORS_ORIGIN}));

app.use(express.json());

app.use('/users',userRouter);
app.use('/rate',userRatingsRouter);
app.use('/ads',adsRouter);
app.use('/favads',favAdsRouter);
app.use('/favusers',favUserRouter);
app.use('/categories',categoryRouter);
app.use('/subcategories',subCategoryRouter);


app.all('*',(req,res)=>res.status(404).json({error:'Not found'}));
app.use(errorHandler);
app.listen(port,()=>console.log(`Server is listening port ${port}`));