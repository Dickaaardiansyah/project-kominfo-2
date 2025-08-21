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

// Import admin controllers
import {
  getAdmin,
  createAdmin,
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

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// ==================== AUTH ROUTES ====================
router.get('/users', verifyToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

// OTP Routes
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

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
router.post('/admin/create', createAdmin);
router.post('/admin/login', loginAdmin);
router.get('/admin/token', refreshAdminToken);
router.delete('/admin/logout', logoutAdmin);

// Protected admin routes (perlu token)
router.get('/admin/profile', verifyAdminToken, getAdmin);
router.get('/admin/all', verifyAdminToken, requireSuperAdmin, getAllAdmins);
router.put('/admin/:adminId/status', verifyAdminToken, requireSuperAdmin, updateAdminStatus);
router.put('/admin/:adminId/password', verifyAdminToken, updateAdminPassword);

export default router;