import pool from '../db/pgPool.js';
import validateWithJoi from '../utils/validationSchemas.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';

export const getMyChats = asyncHandler(async (req, res) => {
  let userId = req.user.userId; //GET my id FROM TOKEN!!!

  const runQuery = `SELECT cm.id, cm.sender, cm.reciever, cm.message, cm.date_time AS "msgTimeStamp", u1.name AS "senderName", u2.name AS "recieverName", cm.read 
  FROM chat_messages AS cm
  JOIN users AS u1 ON sender=u1.id 
  JOIN users AS u2 ON reciever=u2.id 
  WHERE sender=$1 OR reciever=$1
  ORDER BY cm.date_time DESC`;

  const {rows} = await pool.query(runQuery,[userId]);

  let chatList = {};
  rows.forEach(item=>{
    if(item.reciever!==userId){
      if (!chatList.hasOwnProperty(item.reciever)){
        item.idToChat=item.reciever;
        item.nameToChat=item.recieverName;
        chatList[item.reciever]=item;
      }
    }else{
      if (!chatList.hasOwnProperty(item.sender)){
        item.idToChat=item.sender;
        item.nameToChat=item.senderName;
        if(!item.read){
          console.log(item);
          item.markUnread=true;
        }
        chatList[item.sender]=item;
      }
    }
  })
  //console.log(Object.values(chatList));
  res.status(200).json(Object.values(chatList));
});
export const getMyUnread = asyncHandler(async (req, res) => {
  let userId = req.user.userId; //GET my id FROM TOKEN!!!

  const runQuery = `SELECT cm.id, cm.sender, cm.reciever, cm.message, cm.date_time AS "msgTimeStamp", u1.name AS "senderName", u2.name AS "recieverName" 
  FROM chat_messages AS cm
  JOIN users AS u1 ON sender=u1.id 
  JOIN users AS u2 ON reciever=u2.id 
  WHERE reciever=$1 AND read=false
  ORDER BY cm.date_time DESC`;

  const {rows} = await pool.query(runQuery,[userId]);
  
  let chatList = {};
  rows.forEach(item=>{
    if(item.reciever!==userId){
      if (!chatList.hasOwnProperty(item.reciever)){
        item.idToChat=item.reciever;
        item.nameToChat=item.recieverName;
        chatList[item.reciever]=item;
      }
    }else{
      if (!chatList.hasOwnProperty(item.sender)){
        item.idToChat=item.sender;
        item.nameToChat=item.senderName;
        chatList[item.sender]=item;
      }
    }
  })
  console.log(Object.values(chatList));
   res.status(200).json(Object.values(chatList));
});





/* websocket (socket.io) functions */
export const createChatMessage = async (senderId, recieverId, messageText,msgTimeStamp,isRead) => {
  const runQuery = `INSERT INTO chat_messages (sender,reciever,message,date_time,read) VALUES ($1,$2,$3,$4,$5) RETURNING sender,reciever,date_time AS "msgTimeStamp";`;
  const { rows } = await pool.query(runQuery, [senderId, recieverId, messageText, msgTimeStamp,isRead]);
  if(senderId===rows[0].sender && recieverId===rows[0].reciever)return rows[0]
  return null
};

export const getMessagesFromOneChat = async (myUserId,fromUserId) => {
  console.log('getting messages',myUserId,fromUserId);
  const runQuery = `SELECT cm.id, cm.sender, cm.reciever, cm.message, cm.date_time AS "msgTimeStamp", u1.name AS "senderName", u2.name AS "recieverName" 
  FROM chat_messages AS cm
  JOIN users AS u1 ON sender=u1.id 
  JOIN users AS u2 ON reciever=u2.id 
  WHERE (sender=$1 AND reciever=$2) OR (sender=$2 AND reciever=$1)
  ORDER BY cm.date_time`;
  const { rows } = await pool.query(runQuery, [myUserId,fromUserId]);

  const markRead = `UPDATE chat_messages SET read=TRUE
  WHERE sender=$1 AND reciever=$2 AND read=FALSE`;
  const { rows:readMsgs } = await pool.query(markRead, [fromUserId,myUserId]);
  console.log(readMsgs);
  //console.log(rows);
  return rows
};





