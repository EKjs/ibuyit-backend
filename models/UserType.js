import Sequelize, {DataTypes, Model} from 'sequelize';
import { sequelize } from '../db/sqlz';


const UserType = sequelize.define(
    'UserType',
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
  
export default UserType;