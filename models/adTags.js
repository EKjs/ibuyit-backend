import Sequelize, {DataTypes, Model} from 'sequelize';
import { sequelize } from '../db/sqlz';


const adTags = sequelize.define(
    'adTags',
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
        tagId: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
    },{
        freezeTableName: true
      }
);
  
export default adTags;