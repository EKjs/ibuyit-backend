import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import pool from '../db/pgPool.js';
import validateWithJoi from '../utils/validationSchemas.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
//import sanitizeHtml from 'sanitize-html';

export const generateToken = (data, secret) => jwt.sign(data, secret, { expiresIn: '3600s' });

export const getAllUsers = asyncHandler(async (req, res) => {
  
//  const {rows:counter} = await pool.query(`SELECT COUNT(*) FROM cities WHERE state='Bayern'`);
/* const {rows:counter} = await pool.query(`SELECT *
  FROM   cities
  WHERE  state='Bayern'
  ORDER  BY id
  OFFSET 311
  LIMIT  500
`);
  

  console.log(counter); */
  if(req.user.userType!==999)throw new ErrorResponse("You don't have permissions!", 400); //only admin allowed to get all users
  const runQuery = `SELECT u.name,u.email,u.phone,u.register_date AS "registerDate",u.was_online AS "wasOnline",u.user_type AS "userTypeId",u.store_id AS "storeId",
  s.title AS "storeTitle", ut.type_description AS "userType" , count(*) OVER() AS full_count
  FROM users AS u 
  JOIN usertypes AS ut ON u.user_type=ut.id 
  LEFT JOIN stores AS s ON u.store_id=s.id 
  ORDER BY u.id`;
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
  JOIN usertypes AS ut ON u.user_type=ut.id 
  LEFT JOIN stores AS s ON u.store_id=s.id 
  WHERE u.id=$1`;

  const { rowCount, rows } = await pool.query(runQuery, [userId]);
  if (rowCount === 0) throw new ErrorResponse("Id not found", 404);
  res.status(200).json(rows[0]);
});

/* export const createUser = asyncHandler(async (req, res) => {
  const { error } = validateWithJoi(req.body, "createUser");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const { userName, email, pwdHash, phone, registerDate, wasOnline, userType, storeId } = req.body;
  const runQuery = `INSERT INTO users (name, email, pwd_hash, phone, register_date, was_online, user_type, store_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) 
  RETURNING id,name AS "userName", email, user_type AS "userType", store_id AS "storeId"`;
  const { rows } = await pool.query(runQuery, [userName, email, pwdHash, phone, registerDate, wasOnline, userType, storeId]);
  console.log(rows[0]);
  res.status(201).json(rows[0]);
}); */

export const createUser = asyncHandler(async (req,res)=>{ //user registration
  const { error } = validateWithJoi(req.body, "createUser");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const {userName,email,password,phone} = req.body;
/*  if (!name || !email || !password) throw new ErrorResponse('Name, email and password are required!',400); */
  const currentDate = new Date(Date.now());
  const userDefaultTypeOnCreation=0;

  const {rowCount} = await pool.query(`SELECT * FROM users WHERE email=$1`,[email]);
  if (rowCount>0) throw new ErrorResponse('User already exists',403);
  const pwdHash = await bcrypt.hash(password,10);
  const runQuery = `INSERT INTO users (name, email, pwd_hash, phone, register_date, was_online, user_type) VALUES ($1,$2,$3,$4,$5,$6,$7) 
  RETURNING id AS "userId", name AS "userName", user_type AS "userType"`;
  const { rows } = await pool.query(runQuery, [userName, email, pwdHash, phone, currentDate, currentDate, userDefaultTypeOnCreation]);

  //const token = generateToken({userId:rows[0].userId,userName:rows[0].userName},process.env.JWT_SECRET);
  const token = generateToken({ userId: rows[0].userId }, process.env.JWT_SECRET);
  res.status(200).json({ token,userName:rows[0].userName,userId:rows[0].userId,userType:rows[0].userType});
});


export const updateUser = asyncHandler(async (req, res) => {
  const { error } = validateWithJoi(req.body, "updateUserNoPassword");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const userId = parseInt(req.params.id);
  if (!Number.isInteger(userId))
    throw new ErrorResponse("Bad request", 400);

  if(req.user.userId!==userId){
    if(req.user.userType!==999){
      throw new ErrorResponse("You don't have permissions!", 400);
    }
  }
  //only admin allowed to update other users or user can update himself
  const { userName, email, password, phone, storeId } = req.body;
  //const pwdHash = await bcrypt.hash(password,10);
  const runQuery =
    `UPDATE ONLY users SET name=$1, email=$2, phone=$3 WHERE id=$4 
    RETURNING id,name AS "userName", email, user_type AS "userType";`;
  const { rows } = await pool.query(runQuery, [userName, email, phone, userId]);
  res.status(200).json(rows[0]);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);
  console.log('userId',userId);
  console.log('req.user.userId',req.user.userId);
  if (!Number.isInteger(userId))throw new ErrorResponse("Bad request", 400);
  if(req.user.userId!==userId){
    if(req.user.userType!==999){
      throw new ErrorResponse("You don't have permissions!", 400);
    }
  }
  //only admin allowed to delete other users or user can delete himself
  const runQuery = `DELETE FROM ONLY users WHERE id=$1 RETURNING id,name AS "userName", email, user_type AS "userType", store_id AS "storeId"`;
  const { rows } = await pool.query(runQuery, [userId]);
  res.status(200).json(rows[0]);
});


export const signIn = asyncHandler(async (req,res)=>{
  const {email,password} = req.body;
  if (!email || !password) throw new ErrorResponse('Email and password are required!',400);
  const {rowCount,rows} = await pool.query(`SELECT id AS "userId", name AS "userName", pwd_hash AS "pwdHash", user_type AS "userType" FROM users WHERE email=$1`,[email]);
  if (rowCount===0) throw new ErrorResponse('User does not exist', 404);
  const pwdHashesMatch = await bcrypt.compare(password,rows[0].pwdHash);
  if (!pwdHashesMatch) throw new ErrorResponse('Password is not correct', 401);
  const token = generateToken({ userId: rows[0].userId }, process.env.JWT_SECRET);
  await pool.query(`UPDATE users SET was_online = $1 WHERE id = $2;`,[new Date(Date.now()),rows[0].userId]);
  res.status(200).json({ token,userName:rows[0].userName,userId:rows[0].userId,userType:rows[0].userType});
});


export const signOut = asyncHandler(async (req,res)=>{
  //asdsd
  const {email,password} = req.body;
  if (!email || !password) throw new ErrorResponse('Email and password are required!',400);
  const {rowCount,rows} = await pool.query(`SELECT id AS "userId", name AS "userName", pwd_hash AS "pwdHash" FROM users WHERE email=$1`,[email]);
  if (rowCount===0) throw new ErrorResponse('User does not exist', 404);
  const pwdHashesMatch = await bcrypt.compare(password,rows[0].pwdHash);
  if (!pwdHashesMatch) throw new ErrorResponse('Password is not correct', 401);
  const token = generateToken({ userId: rows[0].userId }, process.env.JWT_SECRET);
  res.status(200).json({ token,userName:rows[0].userName,userId:rows[0].userId });
});