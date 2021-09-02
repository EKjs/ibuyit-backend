import pool from '../db/pgPool.js';
import validateWithJoi from '../utils/validationSchemas.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';

export const getAllSubCategories = asyncHandler(async (req, res) => {
  const runQuery = `SELECT id,parent_id AS "parentId",description FROM subcategories ORDER BY id`;
  const {rows} = await pool.query(runQuery);
  
  res.status(200).json(rows);
});

export const getOneSubCategory = asyncHandler(async (req, res) => {
  const subCategoryId = parseInt(req.params.id);
  if (!Number.isInteger(subCategoryId))
    throw new ErrorResponse("Bad request", 400);
  const runQuery = `SELECT id,parent_id AS "parentId",description FROM subcategories WHERE id=$1`;

  const { rowCount, rows } = await pool.query(runQuery, [subCategoryId]);
  if (rowCount === 0) throw new ErrorResponse("Id not found", 404);
  res.status(200).json(rows[0]);
});

export const createSubCategory = asyncHandler(async (req, res) => {
  if(req.user.userType!==999)throw new ErrorResponse("You don't have permissions!", 400); //only admin allowed to get all users
  const { error } = validateWithJoi(req.body, "createSubCategory");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const { parentId,subCategory } = req.body;
  const runQuery = "INSERT INTO subcategories (parent_id, description) VALUES ($1,$2) RETURNING *";
  const { rows } = await pool.query(runQuery, [parentId,subCategory]);
  console.log(rows[0]);
  res.status(201).json(rows[0]);
});

export const updateSubCategory = asyncHandler(async (req, res) => {
  if(req.user.userType!==999)throw new ErrorResponse("You don't have permissions!", 400); //only admin allowed to get all users
  const { error } = validateWithJoi(req.body, "createSubCategory");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const subCategoryId = parseInt(req.params.id);
  if (!Number.isInteger(subCategoryId))
    throw new ErrorResponse("Bad request", 400);
  const { parentId, subCategory } = req.body;
  const runQuery =
    "UPDATE ONLY subcategories SET parent_id=$1, description=$2 WHERE id=$3 RETURNING *";
  const { rows } = await pool.query(runQuery, [parentId, subCategory, subCategoryId]);
  res.status(200).json(rows[0]);
});

export const deleteSubCategory = asyncHandler(async (req, res) => {
  if(req.user.userType!==999)throw new ErrorResponse("You don't have permissions!", 400); //only admin allowed to get all users
  const subCategoryId = parseInt(req.params.id);
  if (!Number.isInteger(subCategoryId))
    throw new ErrorResponse("Bad request", 400);
  const runQuery = "DELETE FROM ONLY subcategories WHERE id=$1 RETURNING *";
  const { rows } = await pool.query(runQuery, [subCategoryId]);
  res.status(200).json(rows[0]);
});
