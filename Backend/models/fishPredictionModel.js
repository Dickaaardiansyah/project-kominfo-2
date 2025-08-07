import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Users from './userModel.js';

const { DataTypes } = Sequelize;

const FishPredictions = db.define('fish_predictions', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Users,
      key: 'id'
    }
  },
  predictedFishName: {
    type: DataTypes.STRING,
    allowNull: false // Hasil prediksi, misalnya "Ikan Cupang"
  },
  probability: {
    type: DataTypes.FLOAT,
    allowNull: false // Probabilitas prediksi, misalnya 0.97
  },
  habitat: {
    type: DataTypes.TEXT,
    allowNull: true // Misalnya: "Sawah, rawa, dan kolam air tenang"
  },
  consumptionSafety: {
    type: DataTypes.STRING,
    allowNull: true // Misalnya: "Tidak umum dikonsumsi"
  },
  fishImage: {
    type: DataTypes.TEXT, // base64 atau URL
    allowNull: true
  },
  predictionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  predictionTime: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  freezeTableName: true,
  timestamps: true
});

// Relasi ke user
FishPredictions.belongsTo(Users, { 
  foreignKey: 'userId',
  as: 'user'
});

export default FishPredictions;
