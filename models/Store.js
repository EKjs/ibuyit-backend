import Sequelize, {DataTypes, Model} from 'sequelize';
import { sequelize } from '../db/sqlz';


const Store = sequelize.define(
    'Store',
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        storeTitle: {
        type: DataTypes.STRING,
        allowNull: false
        },
        adminId: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        storeAddress: {
        type: DataTypes.STRING,
        allowNull: true
        },
        storeDescription: {
        type: DataTypes.TEXT,
        allowNull: true
        },
        storePictureUrl: {
        type: DataTypes.STRING,
        allowNull: true
        },
        storeCoordsLat: {
        type: DataTypes.FLOAT,
        allowNull: true
        },
        storeCoordsLon: {
        type: DataTypes.FLOAT,
        allowNull: true
        },
    }
);
  
export default Store;