import pool from '../db/pgPool.js';
import validateWithJoi from '../utils/validationSchemas.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';

export const getAllStores = asyncHandler(async (req, res) => {
  const runQuery = `SELECT title, admin_id AS "adminId", address, description, photo, coords FROM stores ORDER BY id`;
  const {rows} = await pool.query(runQuery);
  res.status(200).json(rows);
});

export const getOneStore = asyncHandler(async (req, res) => {
  const storeId = parseInt(req.params.id);
  if (!Number.isInteger(storeId))
    throw new ErrorResponse("Bad request", 400);
  const runQuery = `SELECT title, admin_id AS "adminId", address, description, photo, coords FROM stores WHERE id=$1`;

  const { rowCount, rows } = await pool.query(runQuery, [storeId]);
  if (rowCount === 0) throw new ErrorResponse("Id not found", 404);
  res.status(200).json(rows[0]);
});

export const createStore = asyncHandler(async (req, res) => {
  //TODO: get userID from token, check id user already has a store.
  const { error } = validateWithJoi(req.body, "createStore");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const { title, adminId, address, description, photo, coords } = req.body;
  const runQuery = `INSERT INTO stores (title, admin_id, address, description, photo, coords) VALUES ($1,$2,$3,$4,$5,$6) RETURNING title, admin_id AS "adminId", address, description, photo, coords`;
  const { rows } = await pool.query(runQuery, [title, adminId, address, description, photo, coords]);
  console.log(rows[0]);
  res.status(201).json(rows[0]);
});

export const updateStore = asyncHandler(async (req, res) => {
  //GET userID from token, check if USERID==adminId then allow
  const { error } = validateWithJoi(req.body, "createStore");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const storeId = parseInt(req.params.id);
  if (!Number.isInteger(storeId))
    throw new ErrorResponse("Bad request", 400);
  const { title, adminId, address, description, photo, coords } = req.body;
  const runQuery =
    `UPDATE ONLY stores SET title=$1, admin_id=$2, address=$3, description=$4, photo=$5, coords=$6 WHERE id=$7 RETURNING title, admin_id AS "adminId", address, description, photo, coords`;
  const { rows } = await pool.query(runQuery, [title, adminId, address, description, photo, coords, storeId]);
  res.status(200).json(rows[0]);
});

export const deleteStore = asyncHandler(async (req, res) => {
  //GET userID from token, check if USERID==adminId then allow
  const storeId = parseInt(req.params.id);
  if (!Number.isInteger(storeId))
    throw new ErrorResponse("Bad request", 400);
  const runQuery = `DELETE FROM ONLY stores WHERE id=$1 RETURNING title, admin_id AS "adminId", address, description, photo, coords`;
  const { rows } = await pool.query(runQuery, [storeId]);
  res.status(200).json(rows[0]);
});
