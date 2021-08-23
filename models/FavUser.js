import Sequelize, {DataTypes, Model} from 'sequelize';
import { sequelize } from '../db/sqlz';


const FavUser = sequelize.define(
    'FavUser',
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        userId: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        favUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        description: {
        type: DataTypes.STRING,
        allowNull: true
        },
    }
);
  
export default FavUser;