import express from 'express';
import { getUsers, Register, Login, Logout } from '../controllers/Users.js';
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
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Routes Auth/User
router.get('/users', verifyToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

// ML Prediction Routes
router.post('/predict', predictTabular);
router.post('/predict-image', upload.single('image'), predictImage);

// ============ SAVE ROUTES BARU ============
router.post('/api/save-scan', upload.single('image'), saveScan);
router.post('/api/save-to-catalog', upload.single('image'), saveToCatalog);

// ============ GET DATA ROUTES (untuk debugging) ============
router.get('/api/get-scans', getScans);
router.get('/api/get-catalog', getCatalog);

export default router;