import pool from "../db/pgPool.js";
import validateWithJoi from "../utils/validationSchemas.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

export const getAllMessages = asyncHandler(async (req, res) => {
  if(req.user.userType!==999)throw new ErrorResponse("You don't have permissions!", 400); //only admin allowed to updateMessage
  const runQuery = `SELECT 
  m.id, m.from_user_id AS "fromId", m.to_user_id AS "toId", m.msg_title AS "msgTitle", m.msg_text AS "msgText", m.ad_id AS "adId",
  u1.name AS "fromUserName", u2.name AS "toUserName" 
  FROM messages AS m
  JOIN users AS u1 ON m.from_user_id=u1.id
  JOIN users AS u2 ON m.to_user_id=u2.id
  ORDER BY m.id`;
  const {rows} = await pool.query(runQuery);
  res.status(200).json(rows);
});

export const getOneMessage = asyncHandler(async (req, res) => { //only reciever can get it.
  const messageId = parseInt(req.params.id);
  if (!Number.isInteger(messageId))
    throw new ErrorResponse("Bad request", 400);
  const userId = req.user.userId; //my userId

  const runQuery = `SELECT 
  m.id, m.from_user_id AS "fromId", m.to_user_id AS "toId", m.msg_title AS "msgTitle", m.msg_text AS "msgText", m.ad_id AS "adId",
  u1.name AS "fromUserName", u2.name AS "toUserName" 
  FROM messages AS m
  JOIN users AS u1 ON m.from_user_id=u1.id
  JOIN users AS u2 ON m.to_user_id=u2.id
  WHERE m.id=$1 AND m.to_user_id=$2`;

  const { rowCount, rows } = await pool.query(runQuery, [messageId,userId]);
  if (rowCount === 0) throw new ErrorResponse("Id not found", 404);
  res.status(200).json(rows[0]);
});

export const getAllRecievedMessagesOfUser = asyncHandler(async (req, res) => { //only reciever can get it.
  const userId = req.user.userId; //my userId

  const runQuery = `SELECT 
  m.id, m.from_user_id AS "fromId", m.to_user_id AS "toId", m.msg_title AS "msgTitle", m.msg_text AS "msgText", m.ad_id AS "adId",
  u1.name AS "fromUserName", u2.name AS "toUserName" 
  FROM messages AS m
  JOIN users AS u1 ON m.from_user_id=u1.id
  JOIN users AS u2 ON m.to_user_id=u2.id
  WHERE m.to_user_id=$1`;

  const { rows } = await pool.query(runQuery, [userId]);
  res.status(200).json(rows);
});

export const getAllSentMessagesOfUser = asyncHandler(async (req, res) => { //only reciever can get it.
  const userId = req.user.userId; //my userId

  const runQuery = `SELECT 
  m.id, m.from_user_id AS "fromId", m.to_user_id AS "toId", m.msg_title AS "msgTitle", m.msg_text AS "msgText", m.ad_id AS "adId",
  u1.name AS "fromUserName", u2.name AS "toUserName" 
  FROM messages AS m
  JOIN users AS u1 ON m.from_user_id=u1.id
  JOIN users AS u2 ON m.to_user_id=u2.id
  WHERE m.from_user_id=$1`;

  const { rows } = await pool.query(runQuery, [userId]);
  res.status(200).json(rows);
});

//these are service messages for now and user can not send or update the manually
/* export const createMessage = asyncHandler(async (req, res) => {
  if(req.user.userType!==999)throw new ErrorResponse("You don't have permissions!", 400); //only admin allowed to createMessage
  const { error } = validateWithJoi(req.body, "createMessage");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const { message } = req.body;
  const runQuery = "INSERT INTO messages (description) VALUES ($1) RETURNING *";
  const { rows } = await pool.query(runQuery, [message]);
  console.log(rows[0]);
  res.status(201).json(rows[0]);
});

export const updateMessage = asyncHandler(async (req, res) => {
  if(req.user.userType!==999)throw new ErrorResponse("You don't have permissions!", 400); //only admin allowed to updateMessage
  const { error } = validateWithJoi(req.body, "createMessage");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const messageId = parseInt(req.params.id);
  if (!Number.isInteger(messageId))
    throw new ErrorResponse("Bad request", 400);
  const { message } = req.body;
  const runQuery = "UPDATE ONLY messages SET description=$1 WHERE id=$2 RETURNING *";
  const { rows } = await pool.query(runQuery, [message, messageId]);
  res.status(200).json(rows[0]);
}); */

export const deleteMessage = asyncHandler(async (req, res) => { //reciever can delete his messages
  const userId = req.user.userId; //my userId
  const messageId = parseInt(req.params.id);
  if (!Number.isInteger(messageId))
    throw new ErrorResponse("Bad request", 400);
  const runQuery = "DELETE FROM ONLY messages WHERE id=$1 AND to_user_id=$2 RETURNING id";
  const { rows } = await pool.query(runQuery, [messageId,userId]);
  res.status(200).json(rows[0]);
});