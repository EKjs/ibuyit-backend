import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import pool from '../db/pgPool.js';
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from '../utils/ErrorResponse.js';

export const generateToken = (data, secret) => jwt.sign(data, secret, { expiresIn: '3600s' });

//Create an account


// LOG IN
export const signIn = asyncHandler(async (req,res)=>{
    const {email,password} = req.body;
    if (!email || !password) throw new ErrorResponse('Email and password are required!',400);
    const {rowCount,rows} = await pool.query(`SELECT id AS "userId", name AS "userName", pwd_hash AS "pwdHash" FROM users WHERE email=$1`,[email]);
    if (rowCount===0) throw new ErrorResponse('User does not exist', 404);
    const pwdHashesMatch = await bcrypt.compare(password,rows[0].pwdHash);
    if (!pwdHashesMatch) throw new ErrorResponse('Password is not correct', 401);
    const token = generateToken({ userId: rows[0].userId }, process.env.JWT_SECRET);
    res.status(200).json({ token,userName:rows[0].userName,userId:rows[0].userId });
});

export const showUserInfo = asyncHandler(async (req,res)=>{
    res.status(200).json(req.user)
});