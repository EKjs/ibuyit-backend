import Sequelize, {DataTypes, Model} from 'sequelize';
import { sequelize } from '../db/sqlz';


const CarEngineType = sequelize.define(
    'CarEngineType',
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        engineType: {
        type: DataTypes.STRING,
        allowNull: false
        },
    }
);
  
export default CarEngineType;