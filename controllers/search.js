import pool from '../db/pgPool.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import { selectForMultipleAds } from './ads.js';

export const searchAds = asyncHandler(async (req, res) => {
  const skip = req.query.skip ? parseInt(req.query.skip,10) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit,10) : 0;
  
  //Check for bad LIMIT or SKIP values
  if (!Number.isInteger(skip))throw new ErrorResponse('Bad skip value',400)
  else if (!Number.isInteger(limit))throw new ErrorResponse('Bad limit value',400);

  let { cityOrPlz, distance, userSearchQuery} = req.body;
  if (!cityOrPlz && !userSearchQuery)return res.status(200).json([]);

  let runQuery=selectForMultipleAds;
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
      distance=parseInt(distance,10);
      const correctDistance = distance>0 && distance<=100 ? distance : 1;
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

export const distance = (lat1, lon1, lat2, lon2) => {
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




export const searchAdsV2 = asyncHandler(async (req, res) => {
  const skip = req.query.skip ? parseInt(req.query.skip,10) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit,10) : 0;
  
  //Check for bad LIMIT or SKIP values
  if (!Number.isInteger(skip))throw new ErrorResponse('Bad skip value',400)
  else if (!Number.isInteger(limit))throw new ErrorResponse('Bad limit value',400);

  let { cityId, cityCoords, distance, searchText, catId, subCatId } = req.body; //storeId, ownerId
  //if (!cityOrPlz && !userSearchQuery)return res.status(200).json([]);

  let runQuery=selectForMultipleAds;
  if (cityId || cityCoords || searchText || catId || subCatId)runQuery+=` WHERE `;
  let addAnd = false;
  const arrayToDb=[];
  if (searchText){
    arrayToDb.push(`%${searchText}%`);
    runQuery+= ` (ads.title ILIKE $${arrayToDb.length} OR ads.description ILIKE $${arrayToDb.length}) `;
    addAnd=true;
  };

  let endQuery = ` ORDER BY ads.created DESC `;
  if (limit>0)endQuery+=` LIMIT ${limit}`;
  if (skip>0)endQuery+=` OFFSET ${skip}`;

  if (cityId || cityCoords){
    const distanceNum=parseInt(distance,10);
    const correctDistance = distanceNum>0 && distanceNum<=100 ? distanceNum : 0;  //just in case
    
    if (!correctDistance){
      console.log('nodist');
      arrayToDb.push(cityId);
      runQuery+= addAnd ? ` AND ` : '';
      runQuery+= ` ads.city_id = $${arrayToDb.length} `;
      addAnd=true;
    }else{
      //if for some reason we dont have coords of the city
      if(!cityCoords){
        const query=`SELECT name, id, coords FROM cities WHERE id=$1;`;
        const { rows } = await pool.query(query,[cityId]);
        if (rows.length<1)throw new ErrorResponse('City not found!',404); //city deleted???
        cityCoords=rows[0].coords;
      }
      const closeCitiesIds = await getCitiesInRadius(cityCoords[0],cityCoords[1],correctDistance);
      arrayToDb.push(closeCitiesIds);
      runQuery+= addAnd ? ` AND ` : '';
      runQuery+=` ads.city_id = ANY($${arrayToDb.length}::INT[]) `;
      addAnd=true;
    }
  };
  if(subCatId){ //if sub category is set, then the search is more specified
    arrayToDb.push(subCatId);
    runQuery+= addAnd ? ` AND ` : '';
    runQuery+= ` ads.subcategory_id = $${arrayToDb.length} `;
    addAnd=true;
  }else if (catId){//if sub category is NOT set, but we have category then the search is less specified, but better then nothing
    arrayToDb.push(catId);
    runQuery+= addAnd ? ` AND ` : '';
    runQuery+= ` sc.parent_id = $${arrayToDb.length} `;
    addAnd=true;
  };
  console.log(runQuery+endQuery);
  const { rows:searchResult } = await pool.query(runQuery+endQuery,arrayToDb);
  return res.status(200).json(searchResult);
});