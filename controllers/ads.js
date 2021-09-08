import pool from '../db/pgPool.js';
import validateWithJoi from '../utils/validationSchemas.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
//import {moveFilesToImagesFolder} from './processImageFiles.js';


export const selectForMultipleAds = `SELECT ads.id AS "adId", ads.owner_id AS "ownerId", ads.store_id AS "storeId", ads.subcategory_id AS "subCategoryId",
ads.title, ads.description, ads.created, ads.views, ads.price, ads.photos, ads.city_id AS "cityId", cities.name AS "cityName", 
ads.address, ads.coords, ads.current_state AS "currentState", ast.description AS "currentStateDesc", ads.moderate_state AS "moderateState", 
u.name AS "userName",u.was_online AS "wasOnline", u.store_id AS "userStoreId", s.title AS "storeName", sc.description as "subCategory", 
cat.id as "catId", cat.description as "category", u.phone AS "userPhone", ut.id AS "userTypeId", ut.type_description AS "userType", 
count(*) OVER() AS "totalRows" 
FROM ads 
JOIN cities ON ads.city_id=cities.id 
JOIN users AS u ON ads.owner_id=u.id 
JOIN subcategories AS sc ON ads.subcategory_id=sc.id 
JOIN categories AS cat ON sc.parent_id=cat.id 
JOIN usertypes AS ut ON u.user_type=ut.id 
JOIN adstatetype AS ast ON ads.current_state=ast.id 
LEFT JOIN stores AS s ON u.store_id=s.id `;

export const getAdsBySubCatId = asyncHandler(async (req, res) => {
  const subCatId = parseInt(req.params.subCatId,10);
  if (!Number.isInteger(subCatId))throw new ErrorResponse('Bad request',400);
  const skip = req.query.skip ? parseInt(req.query.skip,10) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit,10) : 0;
  
  //Check for bad LIMIT or SKIP values
  if (!Number.isInteger(skip))throw new ErrorResponse('Bad skip value',400)
  else if (!Number.isInteger(limit))throw new ErrorResponse('Bad limit value',400);

  //const totalRows = await pool.query(`SELECT COUNT(*) FROM ads`);

  let runQuery=`${selectForMultipleAds} 
  WHERE sc.id=$1 
  ORDER BY ads.created DESC`;
  if (limit>0)runQuery+=` LIMIT ${limit}`;
  if (skip>0)runQuery+=` OFFSET ${skip}`; 
  const { rows } = await pool.query(runQuery,[subCatId]);
  //const { rowCount: total, rows: allItems } = await pool.query(runQuery);
  //const items = skip===0 && limit===0 ? allItems : limit===0 ? allItems.splice(skip) : allItems.splice(skip,limit);
  res.status(200).json(rows);
});

export const getAdsByCityId = asyncHandler(async (req, res) => {
  const cityId = parseInt(req.params.cityId,10);
  if (!Number.isInteger(cityId))throw new ErrorResponse('Bad request',400);
  const skip = req.query.skip ? parseInt(req.query.skip,10) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit,10) : 0;
  
  //Check for bad LIMIT or SKIP values
  if (!Number.isInteger(skip))throw new ErrorResponse('Bad skip value',400)
  else if (!Number.isInteger(limit))throw new ErrorResponse('Bad limit value',400);

  //const totalRows = await pool.query(`SELECT COUNT(*) FROM ads`);

  let runQuery=`${selectForMultipleAds} 
  WHERE ads.city_id=$1 
  ORDER BY ads.created DESC`;
  if (limit>0)runQuery+=` LIMIT ${limit}`;
  if (skip>0)runQuery+=` OFFSET ${skip}`; 
  const { rows } = await pool.query(runQuery,[cityId]);
  //const { rowCount: total, rows: allItems } = await pool.query(runQuery);
  //const items = skip===0 && limit===0 ? allItems : limit===0 ? allItems.splice(skip) : allItems.splice(skip,limit);
  res.status(200).json(rows);
});

export const getAdsByCatId = asyncHandler(async (req, res) => {
  const catId = parseInt(req.params.catId,10);
  
  if (!Number.isInteger(catId))throw new ErrorResponse('Bad request',400);

  const skip = req.query.skip ? parseInt(req.query.skip,10) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit,10) : 0;
  
  //Check for bad LIMIT or SKIP values
  if (!Number.isInteger(skip))throw new ErrorResponse('Bad skip value',400)
  else if (!Number.isInteger(limit))throw new ErrorResponse('Bad limit value',400);

  //const totalRows = await pool.query(`SELECT COUNT(*) FROM ads`);

  let runQuery=`${selectForMultipleAds} 
  WHERE cat.id=$1 
  ORDER BY ads.created DESC`;
  if (limit>0)runQuery+=` LIMIT ${limit}`;
  if (skip>0)runQuery+=` OFFSET ${skip}`;
  const { rows } = await pool.query(runQuery,[catId]);
  //const { rowCount: total, rows: allItems } = await pool.query(runQuery);
  //const items = skip===0 && limit===0 ? allItems : limit===0 ? allItems.splice(skip) : allItems.splice(skip,limit);
  res.status(200).json(rows);
});

export const getAdsByStoreId = asyncHandler(async (req, res) => {
  const storeId = parseInt(req.params.storeId,10);
  
  if (!Number.isInteger(storeId))throw new ErrorResponse('Bad request',400);

  const skip = req.query.skip ? parseInt(req.query.skip,10) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit,10) : 0;
  
  //Check for bad LIMIT or SKIP values
  if (!Number.isInteger(skip))throw new ErrorResponse('Bad skip value',400)
  else if (!Number.isInteger(limit))throw new ErrorResponse('Bad limit value',400);

  //const totalRows = await pool.query(`SELECT COUNT(*) FROM ads`);

  let runQuery=`${selectForMultipleAds} 
  WHERE ads.store_id=$1 
  ORDER BY ads.created DESC`;
  if (limit>0)runQuery+=` LIMIT ${limit}`;
  if (skip>0)runQuery+=` OFFSET ${skip}`;
  const { rows } = await pool.query(runQuery,[storeId]);
  //const { rowCount: total, rows: allItems } = await pool.query(runQuery);
  //const items = skip===0 && limit===0 ? allItems : limit===0 ? allItems.splice(skip) : allItems.splice(skip,limit);
  res.status(200).json(rows);
});

export const getAllAds = asyncHandler(async (req, res) => {

  
    const skip = req.query.skip ? parseInt(req.query.skip,10) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit,10) : 0;
    
    //Check for bad LIMIT or SKIP values
    if (!Number.isInteger(skip))throw new ErrorResponse('Bad skip value',400)
    else if (!Number.isInteger(limit))throw new ErrorResponse('Bad limit value',400);

    //const totalRows = await pool.query(`SELECT COUNT(*) FROM ads`);
  
    let runQuery=`${selectForMultipleAds} 
	  ORDER BY ads.created DESC`;
    if (limit>0)runQuery+=` LIMIT ${limit}`;
    if (skip>0)runQuery+=` OFFSET ${skip}`;
    const { rows } = await pool.query(runQuery);
    //const { rowCount: total, rows: allItems } = await pool.query(runQuery);
    //const items = skip===0 && limit===0 ? allItems : limit===0 ? allItems.splice(skip) : allItems.splice(skip,limit);
    res.status(200).json(rows);
  });

  export const getAdsByUserId = asyncHandler(async (req, res) => {
    const adsByUserId=parseInt(req.params.userId);

    const skip = req.query.skip ? parseInt(req.query.skip,10) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit,10) : 0;
    
    //Check for bad LIMIT or SKIP values
    if (!Number.isInteger(skip))throw new ErrorResponse('Bad skip value',400)
    else if (!Number.isInteger(limit))throw new ErrorResponse('Bad limit value',400);

    //const totalRows = await pool.query(`SELECT COUNT(*) FROM ads WHERE ads.owner_id=$1`,[adsByUserId]);
    //if (!Number.isInteger(skip))throw new ErrorResponse('Bad skip value',400)
    
    let runQuery=`${selectForMultipleAds} 
    WHERE ads.owner_id=$1 
  	ORDER BY ads.created DESC`;
    if (limit>0)runQuery+=` LIMIT ${limit}`;
    if (skip>0)runQuery+=` OFFSET ${skip}`;
    const { rows } = await pool.query(runQuery,[adsByUserId]);
    //const { rowCount: total, rows: allItems } = await pool.query(runQuery);
    //const items = skip===0 && limit===0 ? allItems : limit===0 ? allItems.splice(skip) : allItems.splice(skip,limit);
    res.status(200).json(rows);
  });
  
  export const getNewAds = asyncHandler(async (req, res) => {
    const skip = req.query.skip ? parseInt(req.query.skip,10) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit,10) : 0;
    
    //Check for bad LIMIT or SKIP values
    if (!Number.isInteger(skip))throw new ErrorResponse('Bad skip value',400)
    else if (!Number.isInteger(limit))throw new ErrorResponse('Bad limit value',400);

    const totalRows = await pool.query(`SELECT COUNT(*) FROM ads`);
  
    let runQuery=`${selectForMultipleAds}
    ORDER BY ads.created DESC`;

    if (limit>0)runQuery+=` LIMIT ${limit}`;
    if (skip>0)runQuery+=` OFFSET ${skip}`;
    const { rows } = await pool.query(runQuery);
    //const { rowCount: total, rows: allItems } = await pool.query(runQuery);
    //const items = skip===0 && limit===0 ? allItems : limit===0 ? allItems.splice(skip) : allItems.splice(skip,limit);
    res.status(200).json({ totalRows, rows });
  });

  export const getOneAd = asyncHandler(async (req, res) => {
    const adId=parseInt(req.params.id);
    if (!Number.isInteger(adId))throw new ErrorResponse('Bad request',400);

    const runQuery=`${selectForMultipleAds}
    WHERE ads.id=$1;`;
  
    const {rowCount, rows } = await pool.query(runQuery,[adId]);
    if(rowCount===0)throw new ErrorResponse('Id not found',404)
    await pool.query(`UPDATE ads SET views = views + 1 WHERE id = $1;`,[adId]);
    res.status(200).json(rows[0]);
  });
  
  export const createAd = asyncHandler(async (req, res) => {
    console.log(req.body);
    //todo: add different queries based on category
    //get ownerId from TOKEN
    const {userId:ownerId,userStoreId} = req.user;//add check for store id req.user.storeId
    //const defaultAdStateOnCreation = 1; //1: Available, 2: Reserved, 3: Pre-oders
    const defaultAdModerateStateOnCreation = 2; //1: To be moderated, 2: Accepted, 3: Denied
    const dateTimeAdCreated = new Date(Date.now());

    const {error} = validateWithJoi(req.body,'createAd');
    if (error)throw new ErrorResponse(error.details[0].message,400);
    
    
    const {sellAsStore,subCategoryId,title,description,price,photos,cityId,address,coords,currentState,userId}=req.body; 
    if (userId!==ownerId)throw new ErrorResponse('You are someone else...',400);
    //moveFilesToImagesFolder(photos);
    console.log('sellAsStore',sellAsStore);
    const storeId = sellAsStore ? userStoreId : null;
    const runQuery=`INSERT INTO ads (owner_id,store_id,subcategory_id,title,description,created,views,price,photos,city_id,address,coords,current_state,moderate_state) 
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id`;
    const { rows } = await pool.query(runQuery,[ownerId,storeId,subCategoryId,title,description,dateTimeAdCreated,0,price,photos,cityId,address,coords,currentState,defaultAdModerateStateOnCreation]);
    console.log(rows[0]);
    res.status(201).json(rows[0]);
  });
  
  export const updateAd = asyncHandler(async (req, res) => { //user updates his own ad
    const adId=parseInt(req.params.id);
    if (!Number.isInteger(adId))throw new ErrorResponse('Bad request',400);
    //const {rowCount, rows:curAdData } = await pool.query(`SELECT * FROM ads WHERE id=$1`,[adId]);
    //if (rowCount===0)throw new ErrorResponse('ID not found',404);
    //const creationDateTime = curAdData[0].created;
    //const views = curAdData[0].views;
    const {userId:tempOwnerId,userStoreId:tempStoreId} = req.user;//add check for store id req.user.storeId
    const defaultAdModerateStateOnUpdate = 2;
    const {error} = validateWithJoi(req.body,'createAd');
    if (error)throw new ErrorResponse(error.details[0].message,400);
    
    const {sellAsStore,subCategoryId,title,description,price,photos,cityId,address,coords,currentState,userId}=req.body;
    let ownerId=tempOwnerId;
    let userStoreId=tempStoreId;
    if(req.user.userType===999){
      ownerId=userId;
      const usrStoreIdQuery = `SELECT store_id AS "storeId" FROM users WHERE id=$1`;
      const {rows} = await pool.query(usrStoreIdQuery,[ownerId]);
      userStoreId=rows[0].storeId;
    }
    const storeId = sellAsStore ? userStoreId : null;
    console.log('sellAsStore',sellAsStore,userStoreId,storeId);
    const runQuery=`UPDATE ONLY ads 
    SET store_id=$1,subcategory_id=$2,title=$3,description=$4,price=$5,photos=$6,city_id=$7,address=$8,coords=$9,current_state=$10,moderate_state=$11 
    WHERE id=$12 AND owner_id=$13 RETURNING id`;
    const { rows } = await pool.query(runQuery,[storeId,subCategoryId,title,description,price,photos,cityId,address,coords,currentState,defaultAdModerateStateOnUpdate,adId,ownerId]);
    res.status(200).json(rows[0]);
  });
  
  export const deleteAd = asyncHandler(async (req, res) => {
    //get userId from token
    //id userId == ownerId then delete
    const ownerId=req.user.userId;
    const adId=parseInt(req.params.id);
    if (!Number.isInteger(adId))throw new ErrorResponse('Bad request',400);
    let runQuery;
    let qArray=[adId];
    if(req.user.userType===999){
      runQuery='DELETE FROM ONLY ads WHERE id=$1 RETURNING id';
    }else{
      runQuery='DELETE FROM ONLY ads WHERE id=$1 AND owner_id=$2 RETURNING id';
      qArray.push(ownerId)
    }
    const { rows } = await pool.query(runQuery,qArray);
    res.status(200).json(rows[0]);
  });


