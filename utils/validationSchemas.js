import Joi from 'joi';

const validateWithJoi = (reqData,reqType)=>{
    let schema;
    switch (reqType) {
      case "createCategory":
        schema = {
          category: Joi.string().required(),
        };
        break;
        case "createSubCategory":
          schema = {
            parentId: Joi.number().required(),
            subCategory: Joi.string().required(),
          };
          break;
      case "createTag":
        schema = {
          tag: Joi.string().required(),
        };
        break;

      case "createCity":
        schema = {
          postalCode: Joi.string().min(2).required(),
          name: Joi.string().min(1).required(),
          county: Joi.string().min(1).required(),
          state: Joi.string().min(1).required(),
          coords: Joi.array().required(),
        };
        break;

      case "createAdState":
        schema = {
          adState: Joi.string().min(1).required(),
        };
        break;

      case "createUserType":
        schema = {
            userType: Joi.string().min(1).required(),
        };
        break;
        
        case "createUserRating":
        schema = {
          targetUser: Joi.number().required(),
          rating: Joi.number().required(),
        };
        break;

      case "createStore":
        schema = {
            title: Joi.string().min(1).required(),
            /* adminId: Joi.number().required(), */
            address: Joi.string().min(2).required(),
            description: Joi.string(),
            photo: Joi.string(),
            coords: Joi.array(),
        };
        break;


      case "createUser":
        schema = {
            userName: Joi.string().min(4).required(),
            email: Joi.string().min(2).required().email(),
            password: Joi.string().min(8).required(),
            phone: Joi.string(),
  /*          registerDate: Joi.date(),
            wasOnline: Joi.date(),
             userType: Joi.number().required(),
            storeId: Joi.number().required(), */
        };
        break;
      case "createAd":
        schema = {
            storeId: Joi.number().allow(null),
            subCategoryId: Joi.number().required(),
            title: Joi.string().min(10).required(),
            description: Joi.string(),
            price: Joi.number().default(0),
            photos: Joi.array(),
            cityId: Joi.number().required(),
            address: Joi.string(),
            coords: Joi.array(),
            currentState:Joi.number(),
        };
        break;


      case "addFavUser":
        schema = {
          favUserId: Joi.number().required(),
          description: Joi.string(),
        };
        break;
        case "addFavAd":
          schema = {
            favAdId: Joi.number().required(),
            description: Joi.string(),
          };
          break;



      case "changeAdState":
        schema = {
          adNewStateId: Joi.number().required(),
        };
        break;


      case "updateSubCategory":
        schema = {
          subCategoryName: Joi.string().min(2).required(),
          catId: Joi.number().required(),
        };
        break;
      default:
        break;
    };
    return Joi.object(schema).validate(reqData)
  };
export default validateWithJoi