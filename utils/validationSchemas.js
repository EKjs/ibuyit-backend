import Joi from 'joi';

const validateWithJoi = (reqData,reqType)=>{
    let schema;
    switch (reqType) {
      case "createCategory":
        schema = {
          parentId: Joi.number().required().default(1),
          category: Joi.string(1).required(),
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




      case "createCity":
        schema = {
          cityName: Joi.string().min(2).required(),
          regionId: Joi.number().required(),
        };
        break;
      case "updateCity":
        schema = {
          cityName: Joi.string().min(2).required(),
          regionId: Joi.number().required(),
        };
        break;
      case "createDuration":
        schema = {
          durationText: Joi.string().min(2).required(),
        };
        break;
      case "updateDuration":
        schema = {
          durationText: Joi.string().min(2).required(),
        };
        break;
      case "createRegion":
        schema = {
          regionName: Joi.string().min(2).required(),
        };
        break;
      case "updateRegion":
        schema = {
          regionName: Joi.string().min(2).required(),
        };
        break;
      case "createSubCategory":
        schema = {
          subCategoryName: Joi.string().min(2).required(),
          catId: Joi.number().required(),
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