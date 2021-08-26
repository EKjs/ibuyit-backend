import jwt from "jsonwebtoken";
import pool from '../db/pgPool.js';
import asyncHandler from "./asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

const verifyUser = asyncHandler(async (req,res,next)=>{
    const {authorization} = req.headers;
    if (!authorization)throw new ErrorResponse('Not authorized',401);
    if (!authorization.startsWith('Bearer ')) throw new ErrorResponse('No Bearer token is present', 400);
    const token = authorization.substring(7, authorization.length);
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const {rowCount,rows:userExists} = await pool.query(`SELECT id AS "userId", name AS "userName", user_type AS "userType", store_id AS "userStoreId" FROM users WHERE id=$1`,[userId]);
    if (rowCount===0) throw new ErrorResponse('User does not exist', 404);
    req.user = userExists[0];//we should have user_type, store_id, and OFC user_id now.
    next();
});

export default verifyUser