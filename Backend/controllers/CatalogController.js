import Users from '../models/userModel.js';
import Admin from '../models/adminModel.js';
import FishPredictions from '../models/fishPredictionModel.js';

// ⭐ USER REQUEST CATALOG ACCESS
export const requestCatalogAccess = async (req, res) => {
    try {
        const userId = req.userId;
        const { reason } = req.body; // Optional reason from user

        // Cari user
        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        // Cek apakah email sudah diverifikasi
        if (!user.isEmailVerified()) {
            return res.status(400).json({
                msg: "Verifikasi email terlebih dahulu sebelum request akses katalog"
            });
        }

        // Cek apakah sudah bisa akses katalog
        if (user.canAccessCatalog()) {
            return res.status(400).json({
                msg: "Anda sudah memiliki akses katalog"
            });
        }

        // Cek status request saat ini
        if (user.catalog_request_status === 'pending') {
            return res.status(400).json({
                msg: "Request akses katalog Anda sedang dalam proses review"
            });
        }

        if (user.catalog_request_status === 'rejected') {
            return res.status(400).json({
                msg: "Request akses katalog Anda ditolak. Hubungi admin untuk info lebih lanjut",
                rejection_reason: user.catalog_rejection_reason
            });
        }

        // Update status request
        await user.update({
            catalog_request_status: 'pending',
            catalog_request_date: new Date(),
            catalog_rejection_reason: null // Clear previous rejection reason
        });

        res.status(200).json({
            msg: "Request akses katalog berhasil dikirim. Tim kami akan review dalam 1-3 hari kerja.",
            data: {
                request_status: 'pending',
                request_date: new Date(),
                reason: reason || null
            }
        });

    } catch (error) {
        console.error('Error requesting catalog access:', error);
        res.status(500).json({ msg: "Server error" });
    }
};

// ⭐ ADMIN GET PENDING CATALOG REQUESTS
export const getPendingCatalogRequests = async (req, res) => {
    try {
        const adminId = req.adminId;
        
        // Cek admin permission
        const admin = await Admin.findByPk(adminId);
        if (!admin || !admin.canApproveCatalogRequests()) {
            return res.status(403).json({
                msg: "Akses ditolak. Tidak ada permission untuk review catalog requests"
            });
        }

        // Ambil pending requests
        const pendingRequests = await Users.getPendingCatalogRequests();

        res.status(200).json({
            msg: "Pending catalog requests berhasil diambil",
            data: pendingRequests.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                request_date: user.catalog_request_date,
                days_pending: Math.floor((new Date() - new Date(user.catalog_request_date)) / (1000 * 60 * 60 * 24))
            })),
            total: pendingRequests.length
        });

    } catch (error) {
        console.error('Error fetching pending catalog requests:', error);
        res.status(500).json({ msg: "Server error" });
    }
};

// ⭐ ADMIN APPROVE/REJECT CATALOG REQUEST
export const processCatalogRequest = async (req, res) => {
    try {
        const adminId = req.adminId;
        const { userId } = req.params;
        const { action, rejection_reason } = req.body; // action: 'approve' | 'reject'

        // Validasi input
        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({
                msg: "Action harus 'approve' atau 'reject'"
            });
        }

        if (action === 'reject' && !rejection_reason) {
            return res.status(400).json({
                msg: "Alasan penolakan harus diisi jika reject"
            });
        }

        // Cek admin permission
        const admin = await Admin.findByPk(adminId);
        if (!admin || !admin.canApproveCatalogRequests()) {
            return res.status(403).json({
                msg: "Akses ditolak. Tidak ada permission untuk approve/reject catalog requests"
            });
        }

        // Cari user
        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        // Cek apakah ada pending request
        if (user.catalog_request_status !== 'pending') {
            return res.status(400).json({
                msg: "User tidak memiliki pending catalog request"
            });
        }

        // Process request
        if (action === 'approve') {
            await user.update({
                role: 'contributor',
                catalog_request_status: 'approved',
                catalog_approved_date: new Date(),
                catalog_approved_by: adminId,
                catalog_rejection_reason: null
            });

            res.status(200).json({
                msg: `Request catalog access untuk ${user.name} berhasil disetujui`,
                data: {
                    user_id: user.id,
                    user_name: user.name,
                    new_role: 'contributor',
                    approved_by: admin.name,
                    approved_date: new Date()
                }
            });

        } else { // reject
            await user.update({
                catalog_request_status: 'rejected',
                catalog_rejection_reason: rejection_reason,
                catalog_approved_date: null,
                catalog_approved_by: null
            });

            res.status(200).json({
                msg: `Request catalog access untuk ${user.name} ditolak`,
                data: {
                    user_id: user.id,
                    user_name: user.name,
                    rejection_reason: rejection_reason,
                    rejected_by: admin.name
                }
            });
        }

    } catch (error) {
        console.error('Error processing catalog request:', error);
        res.status(500).json({ msg: "Server error" });
    }
};

// ⭐ USER CHECK CATALOG ACCESS STATUS
export const getCatalogAccessStatus = async (req, res) => {
    try {
        const userId = req.userId;
        
        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        res.status(200).json({
            msg: "Status akses katalog berhasil diambil",
            data: {
                can_access_catalog: user.canAccessCatalog(),
                role: user.role,
                request_status: user.catalog_request_status,
                request_date: user.catalog_request_date,
                approved_date: user.catalog_approved_date,
                rejection_reason: user.catalog_rejection_reason,
                is_email_verified: user.isEmailVerified()
            }
        });

    } catch (error) {
        console.error('Error checking catalog access status:', error);
        res.status(500).json({ msg: "Server error" });
    }
};

// ⭐ SAVE PREDICTION TO CATALOG (hanya untuk contributor/admin)
export const savePredictionToCatalog = async (req, res) => {
    try {
        const userId = req.userId;
        
        // Cari user dan cek akses
        const user = await Users.findByPk(userId);
        if (!user || !user.canAccessCatalog()) {
            return res.status(403).json({
                msg: "Akses ditolak. Request akses katalog terlebih dahulu"
            });
        }

        // Data dari request body
        const {
            predictionId, // ID dari hasil prediksi yang mau disimpan ke katalog
            namaIkan,
            kategori,
            deskripsiTambahan,
            tanggalDitemukan,
            lokasiPenangkapan,
            kondisiIkan,
            tingkatKeamanan,
            amanDikonsumsi,
            jauhDariPabrik
        } = req.body;

        // Cek apakah prediction exists dan milik user ini
        const prediction = await FishPredictions.findOne({
            where: {
                id: predictionId,
                userId: userId
            }
        });

        if (!prediction) {
            return res.status(404).json({
                msg: "Hasil prediksi tidak ditemukan atau bukan milik Anda"
            });
        }

        // Update prediction dengan data tambahan untuk katalog
        await prediction.update({
            namaIkan: namaIkan || prediction.predictedFishName,
            kategori,
            deskripsiTambahan,
            tanggalDitemukan,
            lokasiPenangkapan,
            kondisiIkan,
            tingkatKeamanan,
            amanDikonsumsi,
            jauhDariPabrik
        });

        res.status(200).json({
            msg: "Hasil prediksi berhasil disimpan ke katalog",
            data: {
                id: prediction.id,
                nama_ikan: prediction.namaIkan,
                kategori: prediction.kategori,
                lokasi: prediction.lokasiPenangkapan,
                tanggal: prediction.tanggalDitemukan
            }
        });

    } catch (error) {
        console.error('Error saving prediction to catalog:', error);
        res.status(500).json({ msg: "Server error" });
    }
};

// ⭐ GET ALL CATALOG ENTRIES (public - bisa dilihat semua orang)
export const getAllCatalogEntries = async (req, res) => {
    try {
        const { 
            kategori, 
            lokasi, 
            search,
            page = 1, 
            limit = 10 
        } = req.query;

        const offset = (page - 1) * limit;
        
        // Build where condition
        const whereCondition = {
            namaIkan: { [Op.ne]: null } // Only entries that have been saved to catalog
        };

        if (kategori) {
            whereCondition.kategori = kategori;
        }

        if (lokasi) {
            whereCondition.lokasiPenangkapan = { [Op.iLike]: `%${lokasi}%` };
        }

        if (search) {
            whereCondition[Op.or] = [
                { namaIkan: { [Op.iLike]: `%${search}%` } },
                { predictedFishName: { [Op.iLike]: `%${search}%` } },
                { deskripsiTambahan: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const catalogEntries = await FishPredictions.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['id', 'name']
                }
            ],
            attributes: [
                'id', 'namaIkan', 'predictedFishName', 'kategori', 
                'deskripsiTambahan', 'tanggalDitemukan', 'lokasiPenangkapan',
                'kondisiIkan', 'tingkatKeamanan', 'amanDikonsumsi', 
                'habitat', 'fishImage', 'createdAt'
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            msg: "Katalog ikan berhasil diambil",
            data: catalogEntries.rows,
            pagination: {
                total_items: catalogEntries.count,
                total_pages: Math.ceil(catalogEntries.count / limit),
                current_page: parseInt(page),
                items_per_page: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Error fetching catalog entries:', error);
        res.status(500).json({ msg: "Server error" });
    }
};