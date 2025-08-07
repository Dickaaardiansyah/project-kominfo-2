import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Users = db.define("users", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [10, 15], // tergantung format no HP
      is: /^[0-9]+$/i
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  gender: {
    type: DataTypes.ENUM("male", "female"),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  },
  // ⭐ Tambahan untuk OTP Email
  otp_code: {
    type: DataTypes.STRING(6),
    allowNull: true,
    comment: 'Kode OTP 6 digit untuk verifikasi email'
  },
  otp_expires: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Waktu expired OTP'
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Status verifikasi email'
  },
  email_verified_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Waktu email diverifikasi'
  },
  refresh_token: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Refresh token untuk login'
  }
}, {
  freezeTableName: true
});

export default Users;