import pool from "../db/pgPool.js";
import validateWithJoi from "../utils/validationSchemas.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

export const getAllFavAds = asyncHandler(async (req, res) => {
  if(req.user.userType!==999)throw new ErrorResponse("You don't have permissions!", 400); //only admin allowed to get all favs
  const runQuery = `SELECT fa.id, fa.user_id AS "userId", fa.ad_id AS "adId", fa.description, u.name AS "userName", ads.title AS "adTitle"  
  FROM favad AS fa 
  JOIN users AS u ON fa.user_id=u.id 
  JOIN ads ON fa.ad_id=ads.id 
  ORDER BY fa.id`;
  const {rows} = await pool.query(runQuery);
  res.status(200).json(rows);
});

export const getOneFavAd = asyncHandler(async (req, res) => {
    const favId = parseInt(req.params.id); //id of this FAV in favads table
    const userId = req.user.userId; //my userId

    if (!Number.isInteger(favId))
      throw new ErrorResponse("Bad request", 400);
//TODO: think on how to deal if an Ad was deleted
    const runQuery = `SELECT fa.id, fa.ad_id AS "adId", fa.description, ads.title AS "adTitle" 
    FROM favad AS fa 
    JOIN ads ON fa.ad_id=ads.id 
    WHERE fa.id=$1 AND fa.user_id=$2`;
    const { rowCount, rows } = await pool.query(runQuery,[favId,userId]);
    if (rowCount === 0) throw new ErrorResponse("Id not found", 404);
    res.status(200).json(rows);
  });

export const getFavAdsOfUser = asyncHandler(async (req, res) => {
  const userId = req.user.userId; //my userId

  const runQuery = `SELECT fa.id, fa.ad_id AS "adId", fa.description, ads.title AS "adTitle" 
  FROM favad AS fa 
  JOIN ads ON fa.ad_id=ads.id 
  WHERE fa.user_id=$1
  ORDER BY fa.id`;

  const { rowCount, rows } = await pool.query(runQuery, [userId]);
  if (rowCount === 0) throw new ErrorResponse("No FAVs found", 404);
  res.status(200).json(rows);
});

export const addFavAd = asyncHandler(async (req, res) => {
  const userId = req.user.userId; //my userId

  const { error } = validateWithJoi(req.body, "addFavAd");
  if (error) throw new ErrorResponse(error.details[0].message, 400);

  const { favAdId,description } = req.body;
  const runQuery = `INSERT INTO favad (user_id,ad_id,description) VALUES ($1,$2,$3) RETURNING id`;
  const { rows } = await pool.query(runQuery, [userId,favAdId,description]);
  console.log(rows[0]);
  res.status(201).json(rows[0]);
});

export const updateFavAd = asyncHandler(async (req, res) => {
    const userId = req.user.userId; //my userId
  const { error } = validateWithJoi(req.body, "addFavAd");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const favId = parseInt(req.params.id);
  if (!Number.isInteger(favId))
    throw new ErrorResponse("Bad request", 400);
  const { favAdId,description } = req.body;
  const runQuery = "UPDATE ONLY favad SET ad_id=$1, description=$2 WHERE id=$3 AND user_id=$4 RETURNING id"; //here will be permissions check
  const { rows } = await pool.query(runQuery, [favAdId,description,favId,userId]);
  res.status(200).json(rows[0]);
});

export const deleteFavAd = asyncHandler(async (req, res) => {
    const userId = req.user.userId; //my userId
  const favId = parseInt(req.params.id);
  if (!Number.isInteger(favId))
    throw new ErrorResponse("Bad request", 400);
  const runQuery = "DELETE FROM ONLY favad WHERE id=$1 AND user_id=$2 RETURNING id";//here will be permissions check
  const { rows } = await pool.query(runQuery, [favId,userId]);
  res.status(200).json(rows[0]);
});