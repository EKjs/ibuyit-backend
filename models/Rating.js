import Sequelize, {DataTypes, Model} from 'sequelize';
import { sequelize } from '../db/sqlz';


const Rating = sequelize.define(
    'Rating',
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
        targetUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        rated: {
        type: DataTypes.INTEGER,
        allowNull: false,
            validate:{
                min:0,
                max:10,
            }
        },
    }
);
  
export default Rating;