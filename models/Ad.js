import Sequelize, {DataTypes, Model} from 'sequelize';
import { sequelize } from '../db/sqlz';


const Ad = sequelize.define(
    'Ad',
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        storeId: {
        type: DataTypes.INTEGER,
        allowNull: true
        },
        categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        title: {
        type: DataTypes.STRING,
        allowNull: false
        },
        description: {
        type: DataTypes.TEXT,
        allowNull: true
        },
        dateTime: {
        type: DataTypes.DATE,
        allowNull: false
        },
        views: {
        type: DataTypes.INTEGER,
        allowNull: true
        },
        price: {
        type: DataTypes.FLOAT,
        allowNull: true
        },
        photos: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
        },
        cityId: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        address: {
        type: DataTypes.STRING,
        allowNull: true
        },
        adCoordsLat: {
        type: DataTypes.FLOAT,
        allowNull: true
        },
        adCoordsLon: {
        type: DataTypes.FLOAT,
        allowNull: true
        },

        adCurState: {
        type: DataTypes.INTEGER,
        allowNull: false
        },

    }
);
  
export default Ad;