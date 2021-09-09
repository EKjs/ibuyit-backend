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
    console.log(userExists[0]);
    req.user = userExists[0];//we should have user_type, store_id, and OFC user_id now.
    next();
});

export const verifyUserSocketIO = async (socket,next)=>{
    const token = socket.handshake.auth.token;
    if (!token) {
        console.log('No token present');
        const err = new Error("Not authorized!");
        err.data = { content: "Not authorized!" }; // additional details
        return next(err);
        //socket.disconnect(true);
    }else{
        console.log('Token present',token);
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        const {rowCount,rows:userExists} = await pool.query(`SELECT id AS "userId", name AS "userName", user_type AS "userType", store_id AS "userStoreId" FROM users WHERE id=$1`,[userId]);
        if (rowCount===0) throw new ErrorResponse('User does not exist', 404);
        //console.log(userExists[0]);
        socket.userData = userExists[0];//we should have user_type, store_id, and OFC user_id now.
        next();
    }
};

/* export const disconnectOtherSocketsOfUser  = async (socket,next)=>{
    
} */

export default verifyUser


/* if (socket.handshake.query && socket.handshake.query.token){
    jwt.verify(socket.handshake.query.token, 'SECRET_KEY', function(err, decoded) {
      if (err) return next(new Error('Authentication error'));
      socket.decoded = decoded;
      next();
    });
  }
  else {
    
  }    */