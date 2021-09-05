import pool from "../db/pgPool.js";
import validateWithJoi from "../utils/validationSchemas.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import {sendEmails} from '../utils/EmailSender.js';

export const getAllAdStates = asyncHandler(async (req, res) => {
  const runQuery = `SELECT * FROM adstatetype ORDER BY id`;
  const {rows} = await pool.query(runQuery);
  res.status(200).json(rows);
});

export const getOneAdState = asyncHandler(async (req, res) => {
  const adStateId = parseInt(req.params.id);
  if (!Number.isInteger(adStateId))
    throw new ErrorResponse("Bad request", 400);
  const runQuery = "SELECT * FROM adstatetype WHERE id=$1";

  const { rowCount, rows } = await pool.query(runQuery, [adStateId]);
  if (rowCount === 0) throw new ErrorResponse("Id not found", 404);
  res.status(200).json(rows[0]);
});

export const createAdState = asyncHandler(async (req, res) => {
  const { error } = validateWithJoi(req.body, "createAdState");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const { adState } = req.body;
  const runQuery = "INSERT INTO adstatetype (description) VALUES ($1) RETURNING *";
  const { rows } = await pool.query(runQuery, [adState]);
  console.log(rows[0]);
  res.status(201).json(rows[0]);
});

export const updateAdState = asyncHandler(async (req, res) => {
  const { error } = validateWithJoi(req.body, "createAdState");
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  const adStateId = parseInt(req.params.id);
  if (!Number.isInteger(adStateId))
    throw new ErrorResponse("Bad request", 400);
  const { adState } = req.body;
  const runQuery = "UPDATE ONLY adstatetype SET description=$1 WHERE id=$2 RETURNING *";
  const { rows } = await pool.query(runQuery, [adState, adStateId]);
  res.status(200).json(rows[0]);
});

export const deleteAdState = asyncHandler(async (req, res) => {
  const adStateId = parseInt(req.params.id);
  if (!Number.isInteger(adStateId))
    throw new ErrorResponse("Bad request", 400);
  const runQuery = "DELETE FROM ONLY adstatetype WHERE id=$1 RETURNING *";
  const { rows } = await pool.query(runQuery, [adStateId]);
  res.status(200).json(rows[0]);
});


export const updateStateOfUsersAdById = asyncHandler(async (req, res) => {
  const adId = parseInt(req.params.id);
  if (!Number.isInteger(adId))
    throw new ErrorResponse("Bad request", 400);
  const ownerId=req.user.userId;

  const {error} = validateWithJoi(req.body,'changeAdState');
  if (error)throw new ErrorResponse(error.details[0].message,400);

  const { adNewStateId } = req.body;

  const runQuery=`UPDATE ONLY ads 
  SET current_state=$1 
  WHERE id=$2 AND owner_id=$3 RETURNING id, title`;
  const { rows } = await pool.query(runQuery,[adNewStateId,adId,ownerId]);
  if (rows[0].id===adId){//if state was successfully changed
    const adTitle = rows[0].title;
    if (adNewStateId===1){//add more checks later, for now just checking id the new state is 'avalible'
      const userList = await getAllUsersFavdThisAd(adId);
      if (userList.length<1)return res.status(200).json('ok');
      const msgTitle = `AD #${adId} - ${userList[0].adTitle} is now avalible.`;
      //const msgText = `Status of AD# ${adId} is now [Avalible]`;
      const mulitpleMessages = userList.map(user=>`(${ownerId},${user.userId},'${msgTitle}',${adId})`).join(',');
      const newMessageQuery = `INSERT INTO messages (from_user_id,to_user_id,msg_title,ad_id) VALUES ${mulitpleMessages};`;
      const { rows } = await pool.query(newMessageQuery);

      const emailList = userList.map(usr=>usr.email).join(',');
      const { protocol } = req;
      const host = req.get('host'); 
      const adURL = `https://ibuyit.me/#/view/${adId}`; //`${protocol}://${host}/view/${adId}`;
      const emailMessage = `Hooray! Hooray! ${adTitle} is now available to buy! <a href="${adURL}">Click here</a> to get to the article's page on <a href="http://ibuyit.me/">ibuyit.me</a> `;//for now
      sendEmails(emailList,emailMessage);
      //app.get('/sendmessages',sendEmails);
      //res.status(200).json(rows[0]);
    }
  }

    res.status(200).json(rows[0]);

});

const getAllUsersFavdThisAd =async (adId) => {
  const runQuery = `SELECT fa.user_id AS "userId", ads.title AS "adTitle", u.email, u.name AS "userName" 
  FROM favad AS fa 
  JOIN ads ON fa.ad_id=ads.id 
  LEFT JOIN users as u ON fa.user_id=u.id 
  WHERE fa.ad_id=$1`;
  const { rows } = await pool.query(runQuery,[adId]);
  console.log(rows);
  return rows
};