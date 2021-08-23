import Sequelize, {DataTypes, Model} from 'sequelize';
import { sequelize } from '../db/sqlz';


const FavAd = sequelize.define(
    'FavAd',
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
        adId: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        description: {
        type: DataTypes.STRING,
        allowNull: true
        },
    }
);
  
export default FavAd;