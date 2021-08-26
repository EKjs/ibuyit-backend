import pool from "../db/pgPool.js";
import validateWithJoi from "../utils/validationSchemas.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

export const getAllCities = asyncHandler(async (req, res) => {
  const skip = req.query.skip ? parseInt(req.query.skip,10) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit,10) : 0;
  //Check for bad LIMIT or SKIP values
  if (!Number.isInteger(skip))throw new ErrorResponse('Bad skip value',400)
  else if (!Number.isInteger(limit))throw new ErrorResponse('Bad limit value',400);

  let runQuery = `SELECT postal_code AS "postalCode",name,county,state,coords,count(*) OVER() AS "totalRows"  FROM cities ORDER BY id`;
  if (limit>0)runQuery+=` LIMIT ${limit}`;
  if (skip>0)runQuery+=` OFFSET ${skip}`;
  console.log();
  const { rows } = await pool.query(runQuery);
  res.status(200).json(rows);
});

export const getOneCity = asyncHandler(async (req, res) => {
  const cityId = parseInt(req.params.id);
  if (!Number.isInteger(cityId)) throw new ErrorResponse("Bad request", 400);
  const runQuery = `SELECT postal_code AS "postalCode",name,county,state,coords FROM cities WHERE id=$1`;

  const { rowCount, rows } = await pool.query(runQuery, [cityId]);
  if (rowCount === 0) throw new ErrorResponse("Id not found", 404);
  res.status(200).json(rows[0]);
});

export const createCity = asyncHandler(async (req, res) => {
  const { error } = validateWithJoi(req.body, "createCity");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const { postalCode, name, county, state, coords } = req.body;
  const runQuery =
    `INSERT INTO cities (postal_code,name,county,state,coords) VALUES ($1,$2,$3,$4,$5) RETURNING id, postal_code AS "postalCode",name,county,state,coords`;
  const { rows } = await pool.query(runQuery, [
    postalCode,
    name,
    county,
    state,
    coords,
  ]);
  console.log(rows[0]);
  res.status(201).json(rows[0]);
});

export const updateCity = asyncHandler(async (req, res) => {
  const { error } = validateWithJoi(req.body, "createCity");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const cityId = parseInt(req.params.id);
  if (!Number.isInteger(cityId)) throw new ErrorResponse("Bad request", 400);
  const { postalCode, name, county, state, coords } = req.body;
  const runQuery =
    `UPDATE ONLY cities SET postal_code=$1, name=$2, county=$3, state=$4, coords=$5,  WHERE id=$6 RETURNING id,postal_code AS "postalCode",name,county,state,coords;`;
  const { rows } = await pool.query(runQuery, [
    postalCode,
    name,
    county,
    state,
    coords,
    cityId,
  ]);
  res.status(200).json(rows[0]);
});

export const deleteCity = asyncHandler(async (req, res) => {
  const cityId = parseInt(req.params.id);
  if (!Number.isInteger(cityId)) throw new ErrorResponse("Bad request", 400);
  const runQuery = `DELETE FROM ONLY cities WHERE id=$1 RETURNING id,postal_code AS "postalCode",name,county,state,coords;`;
  const { rows } = await pool.query(runQuery, [cityId]);
  res.status(200).json(rows[0]);
});
