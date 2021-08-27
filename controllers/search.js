import pool from '../db/pgPool.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';

export const searchAds = asyncHandler(async (req, res) => {
  const skip = req.query.skip ? parseInt(req.query.skip,10) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit,10) : 0;
  
  //Check for bad LIMIT or SKIP values
  if (!Number.isInteger(skip))throw new ErrorResponse('Bad skip value',400)
  else if (!Number.isInteger(limit))throw new ErrorResponse('Bad limit value',400);

  let { cityOrPlz, distance, userSearchQuery} = req.body;
  if (!cityOrPlz && !userSearchQuery)return res.status(200).json([]);

  let runQuery=`SELECT ads.id AS "adId", ads.owner_id AS "ownerId", ads.store_id AS "storeId", ads.subcategory_id AS "subCategoryId",
  ads.title, ads.description, ads.created, ads.views, ads.price, ads.photos, ads.city_id AS "cityId", cities.name AS "cityName", 
  ads.address, ads.coords, ads.current_state AS "currentState", ads.moderate_state AS "moderateState", 
  u.name AS "userName", u.store_id AS "userStoreId", s.title AS "storeName", sc.description as "subcategory", count(*) OVER() AS "totalRows" 
  FROM ads 
  JOIN cities ON ads.city_id=cities.id 
  JOIN users AS u ON ads.owner_id=u.id 
  JOIN subcategories AS sc ON ads.subcategory_id=sc.id 
  LEFT JOIN stores AS s ON u.store_id=s.id `;
  const arrayToDb=[];
  if (userSearchQuery){
    runQuery+= ` WHERE (ads.title ILIKE $1 OR ads.description ILIKE $1) `;
    arrayToDb.push(`%${userSearchQuery}%`);
  }else{
    runQuery+= ` WHERE `;
  };
  let endQuery = `ORDER BY ads.created DESC`;
  if (limit>0)endQuery+=` LIMIT ${limit}`;
  if (skip>0)endQuery+=` OFFSET ${skip}`;

  if (cityOrPlz){
    console.log('city present');
    let query;
    if (Number.isInteger(parseInt(cityOrPlz),10)){ //if it is postal code
      query=`SELECT name, id, coords FROM cities WHERE postal_code=$1;`;
    }else{
      query=`SELECT name, id, coords FROM cities WHERE name=$1;`;
    }
    const { rows } = await pool.query(query,[cityOrPlz]);
    if (rows.length<1)throw new ErrorResponse('City not found!',404); //city deleted???

    if (!distance){
      runQuery+= userSearchQuery ? ` AND ads.city_id = $2 ` : ` ads.city_id = $1 `;
      arrayToDb.push(rows[0].id)
    }else{
      const correctDistance = distance>0 && distance<100 ? distance : 1;
      const closeCitiesIds = await getCitiesInRadius(rows[0].coords[0],rows[0].coords[1],correctDistance);
      runQuery+=userSearchQuery ? ` AND ads.city_id = ANY($2::INT[]) ` : ` ads.city_id = ANY($1::INT[]) `;
      arrayToDb.push(closeCitiesIds)
    }
  }
  const { rows:searchResult } = await pool.query(runQuery+endQuery,arrayToDb);
  return res.status(200).json(searchResult);
});


const getCitiesInRadius = async (lat,lon,radius) => {
  let query=`SELECT id,name, coords FROM cities`;
  const { rows } = await pool.query(query);
  if (rows.length<1)throw new ErrorResponse('City not found!',404); //city deleted???
  const closeCities = rows.filter(city=>distance(lat,lon,city.coords[0],city.coords[1])<radius);
  const closeCitiesIds = closeCities.map(city=>city.id);
  return closeCitiesIds
};

const distance = (lat1, lon1, lat2, lon2) => {
  //thnx to Salvador Dali https://coderoad.ru/365826/Вычислите-расстояние-между-координатами-2-GPS#34486089
  const p = 0.017453292519943295;    // Math.PI / 180
  const c = Math.cos;
  const a = 0.5 - c((lat2 - lat1) * p)/2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))/2;
  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}


export const plzOrCityFinder = asyncHandler(async (req, res) => { //function for giving hints for the search string
  const {searchString} = req.body;
  if (searchString.length<3)return res.status(200).json(searchString);
  const query=`SELECT name, id, coords, postal_code AS "postalCode" FROM cities WHERE name ILIKE $1 OR postal_code ILIKE $1 ;`;
  const { rows } = await pool.query(query,[`%${searchString}%`]);
  return res.status(200).json(rows);
});