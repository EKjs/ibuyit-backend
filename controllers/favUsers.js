import pool from "../db/pgPool.js";
import validateWithJoi from "../utils/validationSchemas.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

export const getAllFavUsers = asyncHandler(async (req, res) => {
    if(req.user.userType!==999)throw new ErrorResponse("You don't have permissions!", 400); //only admin allowed to get all favs
  const runQuery = `SELECT fu.id, fu.user_id AS "userId", fu.target_user_id AS "targetUserId", fu.description, u1.name AS "userName",u2.name AS "favUserName"  
  FROM favusers AS fu 
    JOIN users AS u1 ON fu.user_id=u1.id
    JOIN users AS u2 ON fu.target_user_id = u2.id
  ORDER BY id`;
  const {rows} = await pool.query(runQuery);
  res.status(200).json(rows);
});

export const getOneFavUser = asyncHandler(async (req, res) => {
    const favId = parseInt(req.params.id); //id of this FAV in favusers table
    const userId = req.user.userId; //my userId

    if (!Number.isInteger(favId))
      throw new ErrorResponse("Bad request", 400);

    const runQuery = `SELECT fu.id, fu.target_user_id AS "targetUserId", fu.description, u.name AS "favUserName" 
    FROM favusers AS fu 
    JOIN users AS u ON fu.target_user_id=u.id 
    WHERE fu.id=$1 AND fu.user_id=$2`;
    const { rowCount, rows } = await pool.query(runQuery,[favId,userId]);
    if (rowCount === 0) throw new ErrorResponse("Id not found", 404);
    res.status(200).json(rows);
  });

export const getFavUsersOfUser = asyncHandler(async (req, res) => {
  const userId = req.user.userId; //my userId

  const runQuery = `SELECT fu.id, fu.target_user_id AS "targetUserId", fu.description, u.name AS "userName" 
  FROM favusers AS fu 
  JOIN users AS u ON fu.target_user_id=u.id
  WHERE fu.user_id=$1
  ORDER BY fu.id`;

  const { rowCount, rows } = await pool.query(runQuery, [userId]);
  if (rowCount === 0) throw new ErrorResponse("No FAVs found", 404);
  res.status(200).json(rows);
});

export const addFavUser = asyncHandler(async (req, res) => {
    const userId = req.user.userId; //my userId

  const { error } = validateWithJoi(req.body, "addFavUser");
  if (error) throw new ErrorResponse(error.details[0].message, 400);

  const { favUserId,description } = req.body;
  const runQuery = `INSERT INTO favusers (user_id,target_user_id,description) VALUES ($1,$2,$3) RETURNING id`;
  const { rows } = await pool.query(runQuery, [userId,favUserId,description]);
  console.log(rows[0]);
  res.status(201).json(rows[0]);
});

export const updateFavUser = asyncHandler(async (req, res) => {
    const userId = req.user.userId; //my userId
  const { error } = validateWithJoi(req.body, "addFavUser");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const favId = parseInt(req.params.id);
  if (!Number.isInteger(favId))
    throw new ErrorResponse("Bad request", 400);
  const { favUserId,description } = req.body;
  const runQuery = "UPDATE ONLY favusers SET target_user_id=$1, description=$2 WHERE id=$3 AND user_id=$4 RETURNING id"; //here will be permissions check
  const { rows } = await pool.query(runQuery, [favUserId,description,favId,userId]);
  res.status(200).json(rows[0]);
});

export const deleteFavUser = asyncHandler(async (req, res) => {
    const userId = req.user.userId; //my userId
  const favId = parseInt(req.params.id);
  if (!Number.isInteger(favId))
    throw new ErrorResponse("Bad request", 400);
  const runQuery = "DELETE FROM ONLY favusers WHERE id=$1 AND user_id=$2 RETURNING *";//here will be permissions check
  const { rows } = await pool.query(runQuery, [favId,userId]);
  res.status(200).json(rows[0]);
});