import Sequelize, {DataTypes, Model} from 'sequelize';
import { sequelize } from '../db/sqlz';


const CarModel = sequelize.define(
    'CarModel',
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        parentId: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        modelName: {
        type: DataTypes.STRING,
        allowNull: false
        }
    }
);
  
export default CarModel;