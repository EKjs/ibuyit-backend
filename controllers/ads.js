import pool from '../db/pgPool.js';
import validateWithJoi from '../utils/validationSchemas.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';


export const getAllAds = asyncHandler(async (req, res) => {
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    
    //Check for bad LIMIT or SKIP values
    if (!Number.isInteger(skip))throw new ErrorResponse('Bad skip value',400)
    else if (!Number.isInteger(limit))throw new ErrorResponse('Bad limit value',400);
  
    const runQuery=`SELECT * FROM categories ORDER BY id`;
    const { rowCount: total, rows: allItems } = await pool.query(runQuery);
      
    const items = skip===0 && limit===0 ? allItems : limit===0 ? allItems.splice(skip) : allItems.splice(skip,limit);
    res.status(200).json({ total, items });
  });
  
  export const getOneAd = asyncHandler(async (req, res) => {
    const categoryId=parseInt(req.params.id);
    if (!Number.isInteger(categoryId))throw new ErrorResponse('Bad request',400);
    const runQuery='SELECT * FROM categories WHERE id=$1';
  
    const {rowCount, rows } = await pool.query(runQuery,[categoryId]);
    if(rowCount===0)throw new ErrorResponse('Id not found',404)
    res.status(200).json(rows[0]);
  });
  
  export const createAd = asyncHandler(async (req, res) => {
    const {error} = validateWithJoi(req.body,'createCategory');
    if (error)throw new ErrorResponse(error.details[0].message,400);
    const {category}=req.body;
    const runQuery='INSERT INTO categories (category) VALUES ($1) RETURNING *';
    const { rows } = await pool.query(runQuery,[category]);
    console.log(rows[0]);
    res.status(201).json(rows[0]);
  });
  
  export const updateAd = asyncHandler(async (req, res) => {
    const {error} = validateWithJoi(req.body,'updateCategory');
    if (error)throw new ErrorResponse(error.details[0].message,400);
    const categoryId=parseInt(req.params.id);
    if (!Number.isInteger(categoryId))throw new ErrorResponse('Bad request',400);
    const {category}=req.body;
    const runQuery='UPDATE ONLY categories SET category=$1 WHERE id=$2 RETURNING *';
    const { rows } = await pool.query(runQuery,[category,categoryId]);
    res.status(200).json(rows[0]);
  });
  
  export const deleteAd = asyncHandler(async (req, res) => {
    const categoryId=parseInt(req.params.id);
    if (!Number.isInteger(categoryId))throw new ErrorResponse('Bad request',400);
    const runQuery='DELETE FROM ONLY categories WHERE id=$1 RETURNING *';
    const { rows } = await pool.query(runQuery,[categoryId]);
    res.status(200).json(rows[0]);
  });