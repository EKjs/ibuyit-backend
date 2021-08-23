import Sequelize, {DataTypes, Model} from 'sequelize';
import { sequelize } from '../db/sqlz';


const Color = sequelize.define(
    'Color',
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        color: {
        type: DataTypes.STRING,
        allowNull: false
        },
    }
);
  
export default Color;