import Sequelize, {DataTypes, Model} from 'sequelize';
import { sequelize } from '../db/sqlz';


const Immovable = sequelize.define(
    'Immovable',
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        adId: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        immoTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        bedRooms: {
        type: DataTypes.INTEGER,
        allowNull: true
        },
        bathRooms: {
        type: DataTypes.INTEGER,
        allowNull: true
        },
        constructionStatusId: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        floorNum: {
        type: DataTypes.INTEGER,
        allowNull: true
        },
        totalFloors: {
        type: DataTypes.INTEGER,
        allowNull: true
        },
        parkingSlots: {
        type: DataTypes.INTEGER,
        allowNull: true
        },
        totalArea: {
        type: DataTypes.FLOAT,
        allowNull: true
        },
    }
);
  
export default Immovable;