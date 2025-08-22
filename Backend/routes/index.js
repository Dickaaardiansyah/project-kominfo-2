// routes/index.js - Updated with Catalog Permission System
import express from 'express';
import {
  getUsers,
  Register,
  Login,
  Logout,
  verifyOTP,
  resendOTP
} from '../controllers/Users.js';
import {
  predictTabular,
  predictImage,
  saveScan,
  saveToCatalog,
  getScans,
  getCatalog
} from '../controllers/Models.js';
import { verifyToken } from '../middleware/VerifyToken.js';
import { refreshToken } from '../controllers/RefreshToken.js';
import {
  getAdmin,
  createAdmin,
  loginAdmin,
  logoutAdmin,
  getAllAdmins,
  updateAdminStatus,
  updateAdminPassword
} from '../controllers/Admin.js';
import { verifyAdminToken, requireSuperAdmin } from '../middleware/VerifyAdminToken.js';
import { refreshAdminToken } from '../controllers/AdminRefreshToken.js';

// ⭐ NEW: Import updated catalog controllers
import {
  requestCatalogAccess,
  getCatalogAccessStatus,
  savePredictionToCatalog,
  getAllCatalogEntries,
  getPendingCatalogRequests,
  approveCatalogRequest,
  rejectCatalogRequest,
  getCatalogStatistics
} from '../controllers/CatalogController.js';

import multer from 'multer';
import Users from '../models/userModel.js';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt'; // Tambahkan bcrypt untuk hash password

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// ==================== AUTH ROUTES ====================
router.get('/users', verifyToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.post('/token', refreshToken);
router.delete('/logout', Logout);

// OTP Routes
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

// Endpoint untuk memperbarui data profil
router.put('/users/update', verifyToken, async (req, res) => {
  try {
    const userId = req.userId; // Dapatkan userId dari token
    const { username, email, password, phone, gender, birthday } = req.body;

    // Validasi input
    const updateData = {};
    if (username) {
      if (username.length < 2) {
        return res.status(400).json({ msg: 'Nama pengguna minimal 2 karakter' });
      }
      updateData.name = username; // Sesuaikan dengan field di database
    }
    if (email) {
      if (!email.includes('@')) {
        return res.status(400).json({ msg: 'Format email tidak valid' });
      }
      const existingEmail = await Users.findOne({
        where: { email, id: { [Op.ne]: userId } }
      });
      if (existingEmail) {
        return res.status(400).json({ msg: 'Email sudah digunakan' });
      }
      updateData.email = email;
    }
    if (password && password !== '***********') {
      if (password.length < 6) {
        return res.status(400).json({ msg: 'Password minimal 6 karakter' });
      }
      updateData.password = await bcrypt.hash(password, 10); // Hash password
    }
    if (phone) {
      if (phone.length < 8 || !/^\d+$/.test(phone)) {
        return res.status(400).json({ msg: 'Nomor HP tidak valid, minimal 8 digit dan hanya angka' });
      }
      const existingPhone = await Users.findOne({
        where: { phone, id: { [Op.ne]: userId } }
      });
      if (existingPhone) {
        return res.status(400).json({ msg: 'Nomor HP sudah digunakan' });
      }
      updateData.phone = phone;
    }
    if (gender) {
      if (!['male', 'female'].includes(gender)) {
        return res.status(400).json({ msg: 'Jenis kelamin harus Laki-laki atau Perempuan' });
      }
      updateData.gender = gender;
    }
    if (birthday) {
      const date = new Date(birthday);
      if (isNaN(date) || date > new Date()) {
        return res.status(400).json({ msg: 'Tanggal lahir tidak valid' });
      }
      updateData.birthday = birthday;
    }

    // Jika tidak ada data yang akan diperbarui
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ msg: 'Tidak ada data yang diperbarui' });
    }

    // Perbarui data pengguna
    await Users.update(updateData, { where: { id: userId } });

    res.status(200).json({ msg: 'Data profil berhasil diperbarui' });
  } catch (error) {
    console.error('Kesalahan saat memperbarui profil:', error);
    res.status(500).json({ msg: 'Kesalahan server' });
  }
});

// ==================== ML PREDICTION ROUTES ====================
router.post('/predict', predictTabular);
router.post('/predict-image', upload.single('image'), predictImage);

// ==================== EXISTING SAVE ROUTES ====================
router.post('/api/save-scan', upload.single('image'), saveScan);
router.post('/api/save-to-catalog', upload.single('image'), saveToCatalog); // Keep existing
router.get('/api/get-scans', getScans);
router.get('/api/get-catalog', getCatalog); // Keep existing

// ==================== ⭐ NEW CATALOG PERMISSION SYSTEM ROUTES ====================
// USER Catalog Routes (need login)
router.post('/api/catalog/request-access', verifyToken, requestCatalogAccess);
router.get('/api/catalog/my-status', verifyToken, getCatalogAccessStatus);
router.post('/api/catalog/save-prediction', verifyToken, savePredictionToCatalog);

// PUBLIC Catalog Routes (no auth needed) 
router.get('/api/catalog/entries', getAllCatalogEntries); // New public catalog viewer

// ADMIN Catalog Routes (need admin login)
router.get('/api/catalog/admin/pending-requests', verifyAdminToken, getPendingCatalogRequests);
router.post('/api/catalog/admin/approve/:userId', verifyAdminToken, approveCatalogRequest);
router.post('/api/catalog/admin/reject/:userId', verifyAdminToken, rejectCatalogRequest);
router.get('/api/catalog/admin/statistics', verifyAdminToken, getCatalogStatistics);

// ==================== ADMIN AUTH ROUTES ====================
// Public admin routes (tidak perlu token)
// ==================== ADMIN AUTH ROUTES ====================
router.post('/admin/create', createAdmin);
router.post('/admin/login', loginAdmin);
router.get('/admin/token', refreshAdminToken);
router.delete('/admin/logout', logoutAdmin);

// Protected admin routes
router.get('/admin/profile', verifyAdminToken, getAdmin);
router.get('/admin/all', verifyAdminToken, requireSuperAdmin, getAllAdmins);
router.put('/admin/:adminId/status', verifyAdminToken, requireSuperAdmin, updateAdminStatus);
router.put('/admin/:adminId/password', verifyAdminToken, updateAdminPassword);

export default router;