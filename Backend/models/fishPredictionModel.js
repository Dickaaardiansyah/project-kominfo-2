import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Users from './userModel.js';

const { DataTypes } = Sequelize;

const FishPredictions = db.define('katalog_fish', {
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
  // Field yang sudah ada (hasil AI)
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
  },
  
  // Field tambahan untuk form "Tambahkan ke Katalog"
  namaIkan: {
    type: DataTypes.STRING,
    allowNull: true, // Optional karena bisa sama dengan predictedFishName
    comment: 'Nama ikan yang bisa diedit user'
  },
  kategori: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Kategori ikan: Ikan Konsumsi, Ikan Hias, dll'
  },
  deskripsiTambahan: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Deskripsi tambahan dari user'
  },
  tanggalDitemukan: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Tanggal ikan ditemukan/ditangkap'
  },
  lokasiPenangkapan: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Lokasi penangkapan ikan'
  },
  kondisiIkan: {
    type: DataTypes.ENUM('hidup', 'mati'),
    allowNull: true,
    defaultValue: 'mati',
    comment: 'Kondisi ikan saat ditemukan'
  },
  tingkatKeamanan: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0.98,
    comment: 'Tingkat keamanan konsumsi (0-1)'
  },
  amanDikonsumsi: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
    comment: 'Apakah ikan aman dikonsumsi'
  },
  jauhDariPabrik: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
    comment: 'Apakah lokasi jauh dari pabrik'
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