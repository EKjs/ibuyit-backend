import Sequelize, {DataTypes, Model} from 'sequelize';
import { sequelize } from '../db/sqlz';


const Category = sequelize.define(
    'Category',
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        parentCatId: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        catDescription: {
        type: DataTypes.STRING,
        allowNull: false
        },
    }
);
  
export default Category;