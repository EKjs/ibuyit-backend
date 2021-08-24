import pool from '../db/pgPool.js';
import validateWithJoi from '../utils/validationSchemas.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';

export const getAllCategories = asyncHandler(async (req, res) => {
  const runQuery = `SELECT * FROM categories ORDER BY id`;
  const {rows} = await pool.query(runQuery);
  res.status(200).json(rows);
});

export const getOneCategory = asyncHandler(async (req, res) => {
  const categoryId = parseInt(req.params.id);
  if (!Number.isInteger(categoryId))
    throw new ErrorResponse("Bad request", 400);
  const runQuery = "SELECT * FROM categories WHERE id=$1";

  const { rowCount, rows } = await pool.query(runQuery, [categoryId]);
  if (rowCount === 0) throw new ErrorResponse("Id not found", 404);
  res.status(200).json(rows[0]);
});

export const createCategory = asyncHandler(async (req, res) => {
  const { error } = validateWithJoi(req.body, "createCategory");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const { parentId, category } = req.body;
  const runQuery = "INSERT INTO categories (parent_id, description) VALUES ($1,$2) RETURNING *";
  const { rows } = await pool.query(runQuery, [parentId, category]);
  console.log(rows[0]);
  res.status(201).json(rows[0]);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { error } = validateWithJoi(req.body, "createCategory");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const categoryId = parseInt(req.params.id);
  if (!Number.isInteger(categoryId))
    throw new ErrorResponse("Bad request", 400);
  const { parentId, category } = req.body;
  const runQuery =
    "UPDATE ONLY categories SET parent_id=$1, description=$2 WHERE id=$3 RETURNING *";
  const { rows } = await pool.query(runQuery, [parentId, category, categoryId]);
  res.status(200).json(rows[0]);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = parseInt(req.params.id);
  if (!Number.isInteger(categoryId))
    throw new ErrorResponse("Bad request", 400);
  const runQuery = "DELETE FROM ONLY categories WHERE id=$1 RETURNING *";
  const { rows } = await pool.query(runQuery, [categoryId]);
  res.status(200).json(rows[0]);
});
