import pool from '../db/pgPool.js';
import validateWithJoi from '../utils/validationSchemas.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';

export const getAllUsers = asyncHandler(async (req, res) => {
  const runQuery = `SELECT u.name,u.email,u.phone,u.register_date AS "registerDate",u.was_online AS "wasOnline",u.user_type AS "userTypeId",u.store_id AS "storeId",
  s.title AS "storeTitle", ut.type_description AS "userType" 
  FROM users AS u 
  JOIN stores AS s ON u.store_id=s.id 
  JOIN usertypes AS ut ON u.user_type=ut.id 
  ORDER BY id`;
  const {rows} = await pool.query(runQuery);
  res.status(200).json(rows);
});

export const getOneUser = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);
  if (!Number.isInteger(userId))
    throw new ErrorResponse("Bad request", 400);
  const runQuery = `SELECT 
  u.name,u.email,u.phone,u.register_date AS "registerDate",u.was_online AS "wasOnline",u.user_type AS "userTypeId",u.store_id AS "storeId",
  s.title AS "storeTitle", ut.type_description AS "userType" 
  FROM users AS u 
  JOIN stores AS s ON u.store_id=s.id 
  JOIN usertypes AS ut ON u.user_type=ut.id 
  WHERE id=$1`;

  const { rowCount, rows } = await pool.query(runQuery, [userId]);
  if (rowCount === 0) throw new ErrorResponse("Id not found", 404);
  res.status(200).json(rows[0]);
});

export const createUser = asyncHandler(async (req, res) => {
  const { error } = validateWithJoi(req.body, "createUser");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const { userName, email, pwdHash, phone, registerDate, wasOnline, userType, storeId } = req.body;
  const runQuery = `INSERT INTO users (name, email, pwd_hash, phone, register_date, was_online, user_type, store_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) 
  RETURNING id,name AS "userName", email, user_type AS "userType", store_id AS "storeId"`;
  const { rows } = await pool.query(runQuery, [userName, email, pwdHash, phone, registerDate, wasOnline, userType, storeId]);
  console.log(rows[0]);
  res.status(201).json(rows[0]);
});

export const updateUser = asyncHandler(async (req, res) => {
  const { error } = validateWithJoi(req.body, "createUser");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const userId = parseInt(req.params.id);
  if (!Number.isInteger(userId))
    throw new ErrorResponse("Bad request", 400);
  const { userName, email, pwdHash, phone, registerDate, wasOnline, userType, storeId } = req.body;
  const runQuery =
    `UPDATE ONLY users SET name=$1, email=$2, pwd_hash=$3, phone=$4, register_date=$5, was_online=$6, user_type=$7, store_id=$8 WHERE id=$3 
    RETURNING id,name AS "userName", email, user_type AS "userType", store_id AS "storeId"`;
  const { rows } = await pool.query(runQuery, [userName, email, pwdHash, phone, registerDate, wasOnline, userType, storeId, userId]);
  res.status(200).json(rows[0]);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);
  if (!Number.isInteger(userId))
    throw new ErrorResponse("Bad request", 400);
  const runQuery = `DELETE FROM ONLY users WHERE id=$1 RETURNING id,name AS "userName", email, user_type AS "userType", store_id AS "storeId"`;
  const { rows } = await pool.query(runQuery, [userId]);
  res.status(200).json(rows[0]);
});
