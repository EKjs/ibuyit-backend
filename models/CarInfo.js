import Sequelize, {DataTypes, Model} from 'sequelize';
import { sequelize } from '../db/sqlz';


const CarInfo = sequelize.define(
    'CarInfo',
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
        color: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        model: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        carType: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        doors: {
        type: DataTypes.INTEGER,
        allowNull: true
        },
        transmission: {
        type: DataTypes.INTEGER,
        allowNull: true
        },
        transmissionTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true
        },
        engineTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true
        },
        engineVol: {
        type: DataTypes.INTEGER,
        allowNull: true
        },
        year: {
        type: DataTypes.INTEGER,
        allowNull: true
        },
        odometer: {
        type: DataTypes.INTEGER,
        allowNull: true
        },
    }
);
  
export default CarInfo;