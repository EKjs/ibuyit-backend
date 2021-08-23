import Sequelize, {DataTypes, Model} from 'sequelize';
import { sequelize } from '../db/sqlz';


const Tag = sequelize.define(
    'Tag',
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        description: {
        type: DataTypes.STRING,
        allowNull: true
        },
    }
);
  
export default Tag;