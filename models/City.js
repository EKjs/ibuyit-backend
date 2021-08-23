import Sequelize, {DataTypes, Model} from 'sequelize';
import { sequelize } from '../db/sqlz';


const City = sequelize.define(
    'City',
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false
        },
        postalCode: {
        type: DataTypes.STRING,
        allowNull: false
        },
        name: {
        type: DataTypes.STRING,
        allowNull: false
        },
        county: {
        type: DataTypes.STRING,
        allowNull: true
        },
        state: {
        type: DataTypes.STRING,
        allowNull: true
        },
        coordsLat:{
        type: DataTypes.FLOAT,
        allowNull: false
        },
        coordsLon:{
        type: DataTypes.FLOAT,
        allowNull: false
        },
    }
);
  
export default City;