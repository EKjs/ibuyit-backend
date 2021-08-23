import Sequelize, {DataTypes, Model} from 'sequelize';
import { sequelize } from '../db/sqlz';


const User = sequelize.define(
    'User',
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        name: {
        type: DataTypes.STRING,
        allowNull: false
        },
        email: {
        type: DataTypes.STRING,
        allowNull: false
        },
        pwdHash: {
        type: DataTypes.STRING,
        allowNull: false
        },
        storeId: {
        type: DataTypes.INTEGER,
        allowNull: true
        },
        phone: {
        type: DataTypes.STRING,
        allowNull: true
        },
        userTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        rating: {
        type: DataTypes.INTEGER,
        allowNull: true
        },
        registerDate: {
        type: DataTypes.DATE,
        allowNull: false
        },
        wasOnline: {
        type: DataTypes.DATE,
        allowNull: true
        },
        favAdList: {
        type: DataTypes.INTEGER,
        allowNull: true
        },
        favUserList: {
        type: DataTypes.INTEGER,
        allowNull: true
        },
    }
);
  
export default User;