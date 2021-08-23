import Sequelize, {DataTypes, Model} from 'sequelize';
import { sequelize } from '../db/sqlz';


const CarTransmissionType = sequelize.define(
    'CarTransmissionType',
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        transmissionType: {
        type: DataTypes.STRING,
        allowNull: false
        },
    }
);
  
export default CarTransmissionType;