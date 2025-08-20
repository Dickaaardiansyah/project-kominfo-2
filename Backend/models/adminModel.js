import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Admin = db.define("admins", {
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
  // ⭐ Role Admin untuk Seller Verification
  role: {
    type: DataTypes.ENUM("super_admin", "seller_verifier", "admin"),
    allowNull: false,
    defaultValue: "seller_verifier",
    comment: 'Role admin: super_admin, seller_verifier (untuk acc seller), admin'
  },
  // ⭐ Status Admin
  status: {
    type: DataTypes.ENUM("active", "inactive", "suspended"),
    allowNull: false,
    defaultValue: "active",
    comment: 'Status admin: active, inactive, suspended'
  },
  // ⭐ Tambahan untuk OTP Email (sama seperti Users)
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
  // ⭐ Session Management
  refresh_token: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Refresh token untuk login'
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Waktu login terakhir'
  },
  // ⭐ Admin yang membuat/mengupdate (untuk audit trail)
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID admin yang membuat record ini'
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID admin yang terakhir mengupdate'
  }
}, {
  freezeTableName: true,
  // ⭐ Hooks untuk auto-update created_by dan updated_by
  hooks: {
    beforeCreate: (admin, options) => {
      if (options.adminId) {
        admin.created_by = options.adminId;
      }
    },
    beforeUpdate: (admin, options) => {
      if (options.adminId) {
        admin.updated_by = options.adminId;
        admin.last_login = new Date(); // Update last login saat update
      }
    }
  }
});

// ⭐ Self-referencing associations untuk tracking siapa yang buat/update admin
Admin.belongsTo(Admin, { 
  as: 'creator', 
  foreignKey: 'created_by',
  constraints: false 
});

Admin.belongsTo(Admin, { 
  as: 'updater', 
  foreignKey: 'updated_by',
  constraints: false 
});

export default Admin;