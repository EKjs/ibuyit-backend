import pool from "../db/pgPool.js";
import validateWithJoi from "../utils/validationSchemas.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

export const getAllTags = asyncHandler(async (req, res) => {
  const runQuery = `SELECT * FROM tags ORDER BY id`;
  const {rows} = await pool.query(runQuery);
  res.status(200).json(rows);
});

export const getOneTag = asyncHandler(async (req, res) => {
  const tagId = parseInt(req.params.id);
  if (!Number.isInteger(tagId))
    throw new ErrorResponse("Bad request", 400);
  const runQuery = "SELECT * FROM tags WHERE id=$1";

  const { rowCount, rows } = await pool.query(runQuery, [tagId]);
  if (rowCount === 0) throw new ErrorResponse("Id not found", 404);
  res.status(200).json(rows[0]);
});

export const createTag = asyncHandler(async (req, res) => {
  const { error } = validateWithJoi(req.body, "createTag");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const { tag } = req.body;
  const runQuery = "INSERT INTO tags (description) VALUES ($1) RETURNING *";
  const { rows } = await pool.query(runQuery, [tag]);
  console.log(rows[0]);
  res.status(201).json(rows[0]);
});

export const updateTag = asyncHandler(async (req, res) => {
  const { error } = validateWithJoi(req.body, "createTag");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const tagId = parseInt(req.params.id);
  if (!Number.isInteger(tagId))
    throw new ErrorResponse("Bad request", 400);
  const { tag } = req.body;
  const runQuery = "UPDATE ONLY tags SET description=$1 WHERE id=$2 RETURNING *";
  const { rows } = await pool.query(runQuery, [tag, tagId]);
  res.status(200).json(rows[0]);
});

export const deleteTag = asyncHandler(async (req, res) => {
  const tagId = parseInt(req.params.id);
  if (!Number.isInteger(tagId))
    throw new ErrorResponse("Bad request", 400);
  const runQuery = "DELETE FROM ONLY tags WHERE id=$1 RETURNING *";
  const { rows } = await pool.query(runQuery, [tagId]);
  res.status(200).json(rows[0]);
});