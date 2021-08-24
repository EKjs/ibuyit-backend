import pool from "../db/pgPool.js";
import validateWithJoi from "../utils/validationSchemas.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

export const getAllAdState = asyncHandler(async (req, res) => {
  const runQuery = `SELECT * FROM adstatetype ORDER BY id`;
  const {rows} = await pool.query(runQuery);
  res.status(200).json(rows);
});

export const getOneAdState = asyncHandler(async (req, res) => {
  const adStateId = parseInt(req.params.id);
  if (!Number.isInteger(adStateId))
    throw new ErrorResponse("Bad request", 400);
  const runQuery = "SELECT * FROM adstatetype WHERE id=$1";

  const { rowCount, rows } = await pool.query(runQuery, [adStateId]);
  if (rowCount === 0) throw new ErrorResponse("Id not found", 404);
  res.status(200).json(rows[0]);
});

export const createAdState = asyncHandler(async (req, res) => {
  const { error } = validateWithJoi(req.body, "createAdState");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const { adState } = req.body;
  const runQuery = "INSERT INTO adstatetype (description) VALUES ($1) RETURNING *";
  const { rows } = await pool.query(runQuery, [adState]);
  console.log(rows[0]);
  res.status(201).json(rows[0]);
});

export const updateAdState = asyncHandler(async (req, res) => {
  const { error } = validateWithJoi(req.body, "createAdState");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const adStateId = parseInt(req.params.id);
  if (!Number.isInteger(adStateId))
    throw new ErrorResponse("Bad request", 400);
  const { adState } = req.body;
  const runQuery = "UPDATE ONLY adstatetype SET description=$1 WHERE id=$2 RETURNING *";
  const { rows } = await pool.query(runQuery, [adState, adStateId]);
  res.status(200).json(rows[0]);
});

export const deleteAdState = asyncHandler(async (req, res) => {
  const adStateId = parseInt(req.params.id);
  if (!Number.isInteger(adStateId))
    throw new ErrorResponse("Bad request", 400);
  const runQuery = "DELETE FROM ONLY adstatetype WHERE id=$1 RETURNING *";
  const { rows } = await pool.query(runQuery, [adStateId]);
  res.status(200).json(rows[0]);
});