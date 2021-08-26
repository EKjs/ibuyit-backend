import pool from '../db/pgPool.js';
import validateWithJoi from '../utils/validationSchemas.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';


export const getAllAds = asyncHandler(async (req, res) => {
    const skip = req.query.skip ? parseInt(req.query.skip,10) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit,10) : 0;
    
    //Check for bad LIMIT or SKIP values
    if (!Number.isInteger(skip))throw new ErrorResponse('Bad skip value',400)
    else if (!Number.isInteger(limit))throw new ErrorResponse('Bad limit value',400);

    //const totalRows = await pool.query(`SELECT COUNT(*) FROM ads`);
  
    let runQuery=`SELECT ads.id AS "adId", ads.owner_id AS "ownerId", ads.store_id AS "storeId", ads.subcategory_id AS "subCategoryId",
    ads.title, ads.description, ads.created, ads.views, ads.price, ads.photos, ads.city_id AS "cityId", cities.name AS "cityName", 
    ads.address, ads.coords, ads.current_state AS "currentState", ads.moderate_state AS "moderateState", 
    u.name AS "userName", u.store_id AS "userStoreId", s.title AS "storeName", sc.description as "subcategory", count(*) OVER() AS "totalRows" 
    FROM ads 
	  JOIN cities ON ads.city_id=cities.id 
    JOIN users AS u ON ads.owner_id=u.id 
    JOIN subcategories AS sc ON ads.subcategory_id=sc.id 
    LEFT JOIN stores AS s ON u.store_id=s.id 
	  ORDER BY ads.created DESC`;
    if (limit>0)runQuery+=` LIMIT ${limit}`;
    if (skip>0)runQuery+=` OFFSET ${skip}`;
    const { rows } = await pool.query(runQuery);
    //const { rowCount: total, rows: allItems } = await pool.query(runQuery);
    //const items = skip===0 && limit===0 ? allItems : limit===0 ? allItems.splice(skip) : allItems.splice(skip,limit);
    res.status(200).json({ rows });
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
    
    let runQuery=`SELECT ads.id AS "adId", ads.owner_id AS "ownerId", ads.store_id AS "storeId", ads.subcategory_id AS "subCategoryId",
    ads.title, ads.description, ads.created, ads.views, ads.price, ads.photos, ads.city_id AS "cityId", cities.name AS "cityName", 
    ads.address, ads.coords, ads.current_state AS "currentState", ads.moderate_state AS "moderateState", 
    u.name AS "userName", u.store_id AS "userStoreId", s.title AS "storeName", sc.description as "subcategory", count(*) OVER() AS "totalRows" 
    FROM ads 
	  JOIN cities ON ads.city_id=cities.id 
    JOIN users AS u ON ads.owner_id=u.id 
    JOIN subcategories AS sc ON ads.subcategory_id=sc.id 
    LEFT JOIN stores AS s ON u.store_id=s.id 
    WHERE ads.owner_id=$1 
  	ORDER BY ads.created DESC`;
    if (limit>0)runQuery+=` LIMIT ${limit}`;
    if (skip>0)runQuery+=` OFFSET ${skip}`;
    const { rows } = await pool.query(runQuery,[adsByUserId]);
    //const { rowCount: total, rows: allItems } = await pool.query(runQuery);
    //const items = skip===0 && limit===0 ? allItems : limit===0 ? allItems.splice(skip) : allItems.splice(skip,limit);
    res.status(200).json({ rows });
  });
  
  export const getNewAds = asyncHandler(async (req, res) => {
    const skip = req.query.skip ? parseInt(req.query.skip,10) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit,10) : 0;
    
    //Check for bad LIMIT or SKIP values
    if (!Number.isInteger(skip))throw new ErrorResponse('Bad skip value',400)
    else if (!Number.isInteger(limit))throw new ErrorResponse('Bad limit value',400);

    const totalRows = await pool.query(`SELECT COUNT(*) FROM ads`);
  
    let runQuery=`SELECT ads.id AS "adId", ads.owner_id AS "ownerId", ads.store_id AS "storeId", ads.subcategory_id AS "subCategoryId",
    ads.title, ads.description, ads.created, ads.views, ads.price, ads.photos, ads.city_id AS "cityId", cities.name AS "cityName", 
    ads.address, ads.coords, ads.current_state AS "currentState", ads.moderate_state AS "moderateState", 
    u.name AS "userName", u.store_id AS "userStoreId", s.title AS "storeName", sc.description as "subcategory", count(*) OVER() AS "totalRows" 
    FROM ads 
	  JOIN cities ON ads.city_id=cities.id 
    JOIN users AS u ON ads.owner_id=u.id 
    JOIN subcategories AS sc ON ads.subcategory_id=sc.id 
    LEFT JOIN stores AS s ON u.store_id=s.id 
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

    const runQuery=`SELECT ads.id AS "adId", ads.owner_id AS "ownerId", ads.store_id AS "storeId", ads.subcategory_id AS "subCategoryId",
    ads.title, ads.description, ads.created, ads.views, ads.price, ads.photos, ads.city_id AS "cityId", cities.name AS "cityName", 
    ads.address, ads.coords, ads.current_state AS "currentState", ads.moderate_state AS "moderateState", 
    u.name AS "userName", u.store_id AS "userStoreId", s.title AS "storeName", sc.description as "subcategory", count(*) OVER() AS "totalRows" 
    FROM ads 
	  JOIN cities ON ads.city_id=cities.id 
    JOIN users AS u ON ads.owner_id=u.id 
    JOIN subcategories AS sc ON ads.subcategory_id=sc.id 
    LEFT JOIN stores AS s ON u.store_id=s.id 
    WHERE ads.id=$1`;
  
    const {rowCount, rows } = await pool.query(runQuery,[adId]);
    if(rowCount===0)throw new ErrorResponse('Id not found',404)
    res.status(200).json(rows[0]);
  });
  
  export const createAd = asyncHandler(async (req, res) => {
    //todo: add different queries based on category
    //get ownerId from TOKEN
    const ownerId = req.user.userId;
    const defaultAdStateOnCreation = 1; //1: Available, 2: Reserved, 3: Pre-oders
    const defaultAdModerateStateOnCreation = 2; //1: To be moderated, 2: Accepted, 3: Denied
    const dateTimeAdCreated = new Date(Date.now());

    const {error} = validateWithJoi(req.body,'createAd');
    if (error)throw new ErrorResponse(error.details[0].message,400);
    const {storeId,subCategoryId,title,description,price,photos,cityId,address,coords}=req.body; 
    const runQuery=`INSERT INTO ads (owner_id,store_id,subcategory_id,title,description,created,views,price,photos,city_id,address,coords,current_state,moderate_state) 
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id`;
    const { rows } = await pool.query(runQuery,[ownerId,storeId,subCategoryId,title,description,dateTimeAdCreated,0,price,photos,cityId,address,coords,defaultAdStateOnCreation,defaultAdModerateStateOnCreation]);
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
    const ownerId=req.user.userId;
    const defaultAdModerateStateOnUpdate = 2;
    const {error} = validateWithJoi(req.body,'createAd');
    if (error)throw new ErrorResponse(error.details[0].message,400);
    
    const {storeId,subCategoryId,title,description,price,photos,cityId,address,coords,currentState}=req.body; 
    const runQuery=`UPDATE ONLY ads 
    SET store_id=$1,subcategory_id=$2,title=$3,description=$4,price=$5,photos=$6,city_id=$7,address=$8,coords=$9,current_state=$10,moderate_state=$11 
    WHERE id=$12 AND owner_id=$13 RETURNING id`;
    const { rows } = await pool.query(runQuery,[storeId,subCategoryId,title,description,price,photos,cityId,address,coords,currentState,defaultAdModerateStateOnUpdate,adId,ownerId]);
    res.status(200).json(rows[0]);
  });
  
  export const deleteAd = asyncHandler(async (req, res) => {
    //get userId from token
    //id userId == ownerId then delete
    const adId=parseInt(req.params.id);
    if (!Number.isInteger(adId))throw new ErrorResponse('Bad request',400);
    const runQuery='DELETE FROM ONLY ads WHERE id=$1 RETURNING id';
    const { rows } = await pool.query(runQuery,[adId]);
    res.status(200).json(rows[0]);
  });