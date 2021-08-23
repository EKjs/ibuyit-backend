import Sequelize, {DataTypes, Model} from 'sequelize';
import { sequelize } from '../db/sqlz';


const ImmovableType = sequelize.define(
    'ImmovableType',
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        description: {
        type: DataTypes.STRING,
        allowNull: false
        },
    }
);
  
export default ImmovableType;