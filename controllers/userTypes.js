import pool from "../db/pgPool.js";
import validateWithJoi from "../utils/validationSchemas.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

export const getAllUserTypes = asyncHandler(async (req, res) => {
  if(req.user.userType!==999)throw new ErrorResponse("You don't have permissions!", 400); //only admin allowed to get all users
  const runQuery = `SELECT id, type_description as "typeDescription" FROM usertypes ORDER BY id`;
  const {rows} = await pool.query(runQuery);
  res.status(200).json(rows);
});

export const getOneUserType = asyncHandler(async (req, res) => {
  if(req.user.userType!==999)throw new ErrorResponse("You don't have permissions!", 400); //only admin allowed to get all users
  const userTypeId = parseInt(req.params.id);
  if (!Number.isInteger(userTypeId))
    throw new ErrorResponse("Bad request", 400);
  const runQuery = `SELECT id, type_description as "typeDescription" FROM usertypes WHERE id=$1`;

  const { rowCount, rows } = await pool.query(runQuery, [userTypeId]);
  if (rowCount === 0) throw new ErrorResponse("Id not found", 404);
  res.status(200).json(rows[0]);
});

export const createUserType = asyncHandler(async (req, res) => {
  if(req.user.userType!==999)throw new ErrorResponse("You don't have permissions!", 400); //only admin allowed to get all users
  const { error } = validateWithJoi(req.body, "createUserType");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const { userType,userTypeId } = req.body;
  const runQuery = `INSERT INTO usertypes (id,type_description) VALUES ($1,$2) RETURNING id, type_description as "typeDescription"`;
  const { rows } = await pool.query(runQuery, [userTypeId,userType]);
  console.log(rows[0]);
  res.status(201).json(rows[0]);
});

export const updateUserType = asyncHandler(async (req, res) => {
  if(req.user.userType!==999)throw new ErrorResponse("You don't have permissions!", 400); //only admin allowed to get all users
  const { error } = validateWithJoi(req.body, "createUserType");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const userTypeIdOld = parseInt(req.params.id);
  if (!Number.isInteger(userTypeIdOld))
    throw new ErrorResponse("Bad request", 400);
  const { userType,userTypeId } = req.body;
  const runQuery = `UPDATE ONLY usertypes SET type_description=$1, id=$2 WHERE id=$3 RETURNING id, type_description as "typeDescription"`;
  const { rows } = await pool.query(runQuery, [userType,userTypeId, userTypeIdOld]);
  res.status(200).json(rows[0]);
});

export const deleteUserType = asyncHandler(async (req, res) => {
  if(req.user.userType!==999)throw new ErrorResponse("You don't have permissions!", 400); //only admin allowed to get all users
  const userTypeId = parseInt(req.params.id);
  if (!Number.isInteger(userTypeId))
    throw new ErrorResponse("Bad request", 400);
  const runQuery = `DELETE FROM ONLY usertypes WHERE id=$1 RETURNING id, type_description as "typeDescription"`;
  const { rows } = await pool.query(runQuery, [userTypeId]);
  res.status(200).json(rows[0]);
});