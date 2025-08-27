// routes/index.js - Updated with Catalog Permission System + Email Routes + Missing Approval Status Route
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
  getCatalogStatistics,
  uploadKTP
} from '../controllers/CatalogController.js';

// ⭐ NEW: Import email controllers
import {
  sendCatalogReviewEmail,
  sendCatalogApprovedEmailController,
  sendCatalogRejectedEmailController,
  testEmailConnection,
  testEmailSending
} from '../controllers/EmailController.js';

import multer from 'multer';
import Users from '../models/userModel.js';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';

const router = express.Router();
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 } // Maksimal 5MB
});

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
    const userId = req.userId;
    const { username, email, password, phone, gender, birthday } = req.body;

    const updateData = {};
    if (username) {
      if (username.length < 2) {
        return res.status(400).json({ msg: 'Nama pengguna minimal 2 karakter' });
      }
      updateData.name = username;
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
      updateData.password = await bcrypt.hash(password, 10);
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

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ msg: 'Tidak ada data yang diperbarui' });
    }

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
router.post('/api/save-to-catalog', upload.single('image'), saveToCatalog);
router.get('/api/get-scans', getScans);
router.get('/api/get-catalog', getCatalog);

// ==================== ⭐ NEW CATALOG PERMISSION SYSTEM ROUTES ====================
// USER Catalog Routes (need login)
router.post('/api/catalog/request-access', verifyToken, requestCatalogAccess);
router.get('/api/catalog/my-status', verifyToken, getCatalogAccessStatus);

// ⭐ TAMBAH route yang hilang untuk check approval status
router.get('/api/catalog/approval-status', verifyToken, async (req, res) => {
  try {
    console.log('🔍 Checking approval status for user:', req.userId);

    // Call the existing getCatalogAccessStatus function
    const result = await getCatalogAccessStatus(req, res);

    // If the function hasn't sent a response yet, we'll handle it here
    if (!res.headersSent) {
      return result;
    }
  } catch (error) {
    console.error('❌ Error checking approval status:', error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        status: 'pending',
        msg: 'Error checking approval status',
        error: error.message
      });
    }
  }
});

router.post('/api/catalog/save-prediction', verifyToken, savePredictionToCatalog);

// PUBLIC Catalog Routes (no auth needed) 
router.get('/api/catalog/entries', getAllCatalogEntries);
router.post('/api/catalog/upload-ktp', verifyToken, upload.single('ktp'), uploadKTP);

// ADMIN Catalog Routes (need admin login)
router.get('/api/catalog/admin/pending-requests', verifyAdminToken, getPendingCatalogRequests);
router.post('/api/catalog/admin/approve/:userId', verifyAdminToken, approveCatalogRequest);
router.post('/api/catalog/admin/reject/:userId', verifyAdminToken, rejectCatalogRequest);
router.get('/api/catalog/admin/statistics', verifyAdminToken, getCatalogStatistics);

// ==================== ⭐ NEW EMAIL NOTIFICATION ROUTES ====================
// Test email connection
router.get('/api/email/test-connection', testEmailConnection);

// User email routes (with authentication)
router.post('/api/email/catalog-review', verifyToken, sendCatalogReviewEmail);

// Admin email routes (with admin authentication)
router.post('/api/email/catalog-approved', verifyAdminToken, sendCatalogApprovedEmailController);
router.post('/api/email/catalog-rejected', verifyAdminToken, sendCatalogRejectedEmailController);

// Admin approval/rejection with automatic email sending
router.post('/api/email/admin/approve-user', verifyAdminToken, async (req, res) => {
  try {
    const { userId, email, name } = req.body;

    if (!userId || !email || !name) {
      return res.status(400).json({
        success: false,
        msg: 'User ID, email, dan nama harus diisi'
      });
    }

    console.log('👨‍💼 Admin approving catalog access for user:', userId);

    // Create new request object for approveCatalogRequest
    const approvalReq = {
      ...req,
      params: { userId }
    };

    // Create new response object that doesn't send immediately
    let approvalResult;
    const approvalRes = {
      ...res,
      json: (data) => { approvalResult = data; return data; },
      status: (code) => ({ json: (data) => { approvalResult = { ...data, statusCode: code }; return data; } })
    };

    // Call approval function
    await approveCatalogRequest(approvalReq, approvalRes);

    if (approvalResult && !approvalResult.msg?.includes('gagal')) {
      // Create email request
      const emailReq = {
        ...req,
        body: { email, name }
      };

      let emailResult;
      const emailRes = {
        ...res,
        json: (data) => { emailResult = data; return data; },
        status: (code) => ({ json: (data) => { emailResult = { ...data, statusCode: code }; return data; } })
      };

      // Send approval email
      await sendCatalogApprovedEmailController(emailReq, emailRes);

      return res.json({
        success: true,
        msg: `Catalog access berhasil disetujui dan email telah dikirim ke ${name}`,
        approval: approvalResult,
        email: emailResult
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: 'Gagal menyetujui catalog access',
        error: approvalResult
      });
    }

  } catch (error) {
    console.error('❌ Error in admin approval with email:', error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        msg: 'Server error saat approval user',
        error: error.message
      });
    }
  }
});

router.post('/api/email/admin/reject-user', verifyAdminToken, async (req, res) => {
  try {
    const { userId, email, name, reason } = req.body;

    if (!userId || !email || !name) {
      return res.status(400).json({
        success: false,
        msg: 'User ID, email, dan nama harus diisi'
      });
    }

    console.log('👨‍💼 Admin rejecting catalog access for user:', userId);

    // Create new request object for rejectCatalogRequest
    const rejectionReq = {
      ...req,
      params: { userId },
      body: { ...req.body, reason }
    };

    // Create new response object that doesn't send immediately
    let rejectionResult;
    const rejectionRes = {
      ...res,
      json: (data) => { rejectionResult = data; return data; },
      status: (code) => ({ json: (data) => { rejectionResult = { ...data, statusCode: code }; return data; } })
    };

    // Call rejection function
    await rejectCatalogRequest(rejectionReq, rejectionRes);

    if (rejectionResult && !rejectionResult.msg?.includes('gagal')) {
      // Create email request
      const emailReq = {
        ...req,
        body: { email, name, reason }
      };

      let emailResult;
      const emailRes = {
        ...res,
        json: (data) => { emailResult = data; return data; },
        status: (code) => ({ json: (data) => { emailResult = { ...data, statusCode: code }; return data; } })
      };

      // Send rejection email
      await sendCatalogRejectedEmailController(emailReq, emailRes);

      return res.json({
        success: true,
        msg: `Catalog access berhasil ditolak dan email telah dikirim ke ${name}`,
        rejection: rejectionResult,
        email: emailResult
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: 'Gagal menolak catalog access',
        error: rejectionResult
      });
    }

  } catch (error) {
    console.error('❌ Error in admin rejection with email:', error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        msg: 'Server error saat reject user',
        error: error.message
      });
    }
  }
});

// Test email sending (for development)
router.post('/api/email/test', testEmailSending);

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