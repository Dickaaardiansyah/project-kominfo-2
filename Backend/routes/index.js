// Update routes/index.js - tambahkan import dan routes baru
import express from 'express';
import {
  getUsers,
  Register,
  Login,
  Logout,
  verifyOTP,      // ⭐ NEW
  resendOTP       // ⭐ NEW
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

// Import admin controllers
import {
  getAdmin,
  createAdmin,     // Ganti dari registerAdmin
  loginAdmin,
  logoutAdmin,
  getAllAdmins,
  updateAdminStatus,
  updateAdminPassword
} from '../controllers/Admin.js';

// Import admin middleware
import { verifyAdminToken, requireSuperAdmin } from '../middleware/VerifyAdminToken.js';

// Import admin refresh token
import { refreshAdminToken } from '../controllers/AdminRefreshToken.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// ==================== AUTH ROUTES ====================
// Existing routes
router.get('/users', verifyToken, getUsers);
router.post('/users', Register);                    // Step 1: Register + Send OTP
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

// ⭐ NEW OTP Routes
router.post('/verify-otp', verifyOTP);              // Step 2: Verify OTP + Activate Account
router.post('/resend-otp', resendOTP);              // Resend OTP jika expired/tidak terima

// ==================== ML PREDICTION ROUTES ====================
router.post('/predict', predictTabular);
router.post('/predict-image', upload.single('image'), predictImage);

// ==================== SAVE ROUTES ====================
router.post('/api/save-scan', upload.single('image'), saveScan);
router.post('/api/save-to-catalog', upload.single('image'), saveToCatalog);

// ==================== GET DATA ROUTES ====================
router.get('/api/get-scans', getScans);
router.get('/api/get-catalog', getCatalog);


// ==================== ADMIN AUTH ROUTES ====================
// Public admin routes (tidak perlu token)
router.post('/admin/create', createAdmin);              // Create admin manual (via API/Postman)
router.post('/admin/login', loginAdmin);                // Login admin
router.get('/admin/token', refreshAdminToken);          // Refresh admin token
router.delete('/admin/logout', logoutAdmin);            // Logout admin

// Protected admin routes (perlu token)
router.get('/admin/profile', verifyAdminToken, getAdmin);                              // Get admin profile
router.get('/admin/all', verifyAdminToken, requireSuperAdmin, getAllAdmins);           // Get all admins (super admin only)
router.put('/admin/:adminId/status', verifyAdminToken, requireSuperAdmin, updateAdminStatus);    // Update admin status
router.put('/admin/:adminId/password', verifyAdminToken, updateAdminPassword); 

export default router;