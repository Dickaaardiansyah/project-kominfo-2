import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Katalog = db.define("katalog", {
  nama_ikan: {
    type: DataTypes.STRING,
    allowNull: false
  },
  habitat: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  konsumsi: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  freezeTableName: true
});

export default Katalog;
