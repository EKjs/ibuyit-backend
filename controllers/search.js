import pool from '../db/pgPool.js';
import sanitizeHtml from 'sanitize-html';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import axios from 'axios';

export const searchAds = asyncHandler(async (req, res) => {
  let { cityOrZip, distance, userSearchQuery} = req.body;
  if (!cityOrZip && !distance && !userSearchQuery)return res.status(200).json([]);
  cityOrZip = sanitizeHtml(cityOrZip);
  userSearchQuery = sanitizeHtml(userSearchQuery);
  console.log(cityOrZip, distance, userSearchQuery);
  let runQuery=`SELECT ads.id AS "adId", ads.owner_id AS "ownerId", ads.store_id AS "storeId", ads.subcategory_id AS "subCategoryId",
  ads.title, ads.description, ads.created, ads.views, ads.price, ads.photos, ads.city_id AS "cityId", cities.name AS "cityName", 
  ads.address, ads.coords, ads.current_state AS "currentState", ads.moderate_state AS "moderateState", 
  u.name AS "userName", u.store_id AS "userStoreId", s.title AS "storeName", sc.description as "subcategory", count(*) OVER() AS "totalRows" 
  FROM ads 
  JOIN cities ON ads.city_id=cities.id 
  JOIN users AS u ON ads.owner_id=u.id 
  JOIN subcategories AS sc ON ads.subcategory_id=sc.id 
  LEFT JOIN stores AS s ON u.store_id=s.id 
  WHERE (ads.title ILIKE $1 OR ads.description ILIKE $1) `;
  const endQuery = `ORDER BY ads.created DESC`;
  const arrayToDb=[`%${userSearchQuery}%`];

  if (cityOrZip){
    console.log('city present');
    let query;
    if (Number.isInteger(parseInt(cityOrZip),10)){ //if it is postal code
      query=`SELECT name, id, coords FROM cities WHERE postal_code=$1;`;
    }else{
      query=`SELECT name, id, coords FROM cities WHERE name=$1;`;
    }
    const { rows } = await pool.query(query,[cityOrZip]);
    if (rows.length<1)throw new ErrorResponse('City not found!',404); //city deleted???

    if (!distance){
      console.log('no distance');
      runQuery+=`AND ads.city_id = $2 `;
      arrayToDb.push(rows[0].id)
    }else{
      console.log('distance present');
      const correctDistance = distance>0 && distance<100 ? distance * 1000 : 1000;
      console.log(correctDistance);
      const closeCitiesIds = await getCitiesInRadius(rows[0].coords[0],rows[0].coords[1],correctDistance);

      runQuery+=`AND ads.city_id = ANY($2::INT[]) `;
      arrayToDb.push(closeCitiesIds)
    }
  }
  console.log('final query=',runQuery+endQuery);
  console.log('array=',arrayToDb);
  const { rows:searchResult } = await pool.query(runQuery+endQuery,arrayToDb);
  return res.status(200).json(searchResult);
});


const getCitiesInRadius = async (lat,lon,radius) => {
  const URL=`https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?apiKey=${process.env.HEREAPI_KEY}&mode=retrieveAreas&level=city&gen=9&maxresults=30&prox=${lat},${lon},${radius}`;
  const {data} = await axios.get(URL);
  const closeCitiesIds = data.Response.View[0].Result.map(city=>parseInt(city.Location.MapReference.CityId,10));
  return closeCitiesIds
};