import Sequelize, {DataTypes, Model} from 'sequelize';
import { sequelize } from '../db/sqlz';


const adStateType = sequelize.define(
    'adStateType',
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        typeDescription: {
        type: DataTypes.STRING,
        allowNull: false
        },
    }
);
  
export default adStateType;