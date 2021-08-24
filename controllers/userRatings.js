import pool from "../db/pgPool.js";
import validateWithJoi from "../utils/validationSchemas.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

//getAvgRatingOfUser, createUserRating, getUsersRatings

export const getUsersRatings = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id); //TODO: GET IT FROM TOKEN!!!
  if (!Number.isInteger(userId))
    throw new ErrorResponse("Bad request", 400);
  const runQuery = `SELECT r.target_user_id, r.rated, u.name 
  JOIN users AS u ON r.target_user_id=u.id 
  FROM ratings AS r 
  WHERE user_id=$1`;

  const { rowCount, rows } = await pool.query(runQuery, [userId]);
  if (rowCount === 0) throw new ErrorResponse("Id not found", 404);
  res.status(200).json(rows[0]);
});

export const getAvgRatingOfUser = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id); //TODO: GET IT FROM TOKEN!!!
  if (!Number.isInteger(userId))
    throw new ErrorResponse("Bad request", 400);
  const runQuery = `SELECT AVG(rated)::numeric(10,2) 
  FROM ratings
  WHERE target_user_id=$1`;

  const { rowCount, rows } = await pool.query(runQuery, [userId]);
  if (rowCount === 0) throw new ErrorResponse("Id not found", 404);
  res.status(200).json(rows[0]);
});

export const createUserRating = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id); //TODO: GET IT FROM TOKEN!!!
  if (!Number.isInteger(userId))
    throw new ErrorResponse("Bad request", 400);
  const { error } = validateWithJoi(req.body, "createUserRating");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const { targetUser,rating } = req.body;
  const runQuery = "INSERT INTO ratings (user_id,target_user_id,rated) VALUES ($1,$2,$3) RETURNING *";
  const { rows } = await pool.query(runQuery, [userId,targetUser,rating]);
  console.log(rows[0]);
  res.status(201).json(rows[0]);
});
