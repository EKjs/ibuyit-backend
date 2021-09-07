import pool from '../db/pgPool.js';
import validateWithJoi from '../utils/validationSchemas.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import { distance } from './search.js';

//for 'Map' page
export const getStoresInRadius = asyncHandler(async (req, res) => {
  const { error } = validateWithJoi(req.body, "storesOnMap");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const { coords, radius } = req.body;
  const query = `SELECT s.id, s.title, s.admin_id AS "adminId", u.name AS "storeAdmin", s.address, s.description, s.photo, s.coords 
  FROM stores AS s
  JOIN users AS u ON s.admin_id=u.id`;
  const { rows } = await pool.query(query);
  if (rows.length<1)throw new ErrorResponse('Store not found!',404);
  const closeStores = rows.filter(store=>distance(coords[0],coords[1],store.coords[0],store.coords[1])<radius);
  //return closeStores
  res.status(200).json(closeStores);
});

export const getAllStores = asyncHandler(async (req, res) => {
  const runQuery = `SELECT s.id, s.title, s.admin_id AS "adminId", u.name AS "storeAdmin", s.address, 
  s.description, s.photo, s.coords, s.city_id AS "cityId", c.name AS "cityName"  
  FROM stores AS s
  JOIN users AS u ON s.admin_id=u.id
  JOIN cities AS c ON s.city_id=c.id
  ORDER BY s.id`;
  const {rows} = await pool.query(runQuery);
  res.status(200).json(rows);
});

export const getOneStore = asyncHandler(async (req, res) => {
  const storeId = parseInt(req.params.id);
  if (!Number.isInteger(storeId))
    throw new ErrorResponse("Bad request", 400);
  const runQuery = `SELECT s.id, s.title, s.admin_id AS "adminId", u.name AS "storeAdmin", s.address, s.description, s.photo, s.coords, s.city_id AS "cityId",
   c.name AS "cityName"   
  FROM stores AS s
  JOIN users AS u ON s.admin_id=u.id 
  JOIN cities AS c ON c.id=s.city_id
  WHERE s.id=$1`;

  const { rowCount, rows } = await pool.query(runQuery, [storeId]);
  if (rowCount === 0) throw new ErrorResponse("Id not found", 404);
  res.status(200).json(rows[0]);
});

export const getMyStore = asyncHandler(async (req, res) => {
  const userId = req.user.userId; //GET my id FROM TOKEN!!!
  const runQuery = `SELECT s.id, s.title, s.admin_id AS "adminId", s.address, s.description, s.photo, s.coords, s.city_id AS "cityId",
   c.name AS "cityName"   
  FROM stores AS s
  JOIN cities AS c ON c.id=s.city_id
  WHERE s.admin_id=$1`;
  const { rows } = await pool.query(runQuery, [userId]);
  res.status(200).json(rows[0]);
});


export const createStore = asyncHandler(async (req, res) => {
  const userId = req.user.userId; //GET my id FROM TOKEN!!!
  const userStoreId = req.user.userStoreId;
  if (userStoreId)throw new ErrorResponse('User already has a store', 400);
  const { error } = validateWithJoi(req.body, "createStore");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const { title, address, description, photo, coords,cityId } = req.body;
  const runQuery = `INSERT INTO stores (title, admin_id, address, description, photo, coords,city_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, title, admin_id AS "adminId", address, description, photo, coords, city_id AS "cityId";`;
  const { rows } = await pool.query(runQuery, [title, userId, address, description, photo, coords,cityId]);
  const updateUser = await pool.query(`UPDATE ONLY users SET store_id=$1 WHERE id=$2 RETURNING id, store_id AS "storeId";`,[rows[0].id,userId]);
  console.log(updateUser.rows);
  console.log(rows[0]);
  res.status(201).json(rows[0]);
});

export const updateStore = asyncHandler(async (req, res) => {
  let userId = req.user.userId; //GET my id FROM TOKEN!!!
  const { error } = validateWithJoi(req.body, "createStore");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const storeId = parseInt(req.params.id);
  if (!Number.isInteger(storeId))
    throw new ErrorResponse("Bad request", 400);
  const { title, address, description, photo, coords,cityId,ownerId } = req.body;
  if(userId!==ownerId){
    if(req.user.userType!==999){
      throw new ErrorResponse("You don't have permissions!", 400);
    }
    userId=ownerId;
  }
  const runQuery =
    `UPDATE ONLY stores SET title=$1, address=$3, description=$4, photo=$5, coords=$6, city_id=$7 WHERE id=$8 AND admin_id=$2 RETURNING id, title, admin_id AS "adminId", address, description, photo, coords, city_id AS "cityId";`;
    //updates only WHERE  admin_id=token.userId
  const { rows } = await pool.query(runQuery, [title, userId, address, description, photo, coords,cityId, storeId]);
  res.status(200).json(rows[0]);
});

export const deleteStore = asyncHandler(async (req, res) => {
  const userId = req.user.userId; //GET my id FROM TOKEN!!!
  const storeId = parseInt(req.params.id);
  if (!Number.isInteger(storeId))
    throw new ErrorResponse("Bad request", 400);
  const runQuery = `DELETE FROM ONLY stores WHERE id=$1 AND admin_id=$2 RETURNING id, title, address, description, photo, coords`; //deletes a store where admin_id=userId
  const { rows:deletedStore } = await pool.query(runQuery, [storeId,userId]);
  if (deletedStore[0].id===storeId){//if the store was successfully deleted and ID returned
    //update USER in USERS table - remove storeId
    const runSecondQuery =
    `UPDATE ONLY users SET store_id=NULL WHERE id=$1 
    RETURNING id, name AS "userName", email, user_type AS "userType", store_id AS "storeId"`;
    const { rows:deleteFromUsers } = await pool.query(runSecondQuery, [userId]);
    //return res.status(200).json(deleteFromUsers[0]);
  }
  res.status(200).json(deletedStore[0]);
});
