import Users from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import { generateOTP, sendOTPEmail, sendWelcomeEmail } from '../services/emailService.js';


export const getUsers = async (req, res) => {
    try {
        // ✅ Ambil userId dari token
        const userId = req.userId;

        console.log('Current user ID from token:', userId); // Debug log

        if (!userId) {
            return res.status(400).json({ msg: "User ID tidak ditemukan dalam token" });
        }

        // ✅ Return data user yang sedang login saja
        const user = await Users.findOne({
            where: { id: userId },
            attributes: [
                'id', 'name', 'email'
            ]
        });

        if (!user) {
            console.log('User not found for ID:', userId);
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        console.log('User found:', user.name);
        res.json(user); // Return single object

    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ msg: "Server error" });
    }
}

export const Register = async (req, res) => {
    const {
        name,
        phone,
        email,
        gender,
        password,
        confirmPassword
    } = req.body;

    // Validasi input dasar
    if (!name || !phone || !email || !gender || !password || !confirmPassword) {
        return res.status(400).json({
            msg: "Nama, no telp, email, jenis kelamin, password, dan konfirmasi password wajib diisi"
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            msg: "Password dan Konfirmasi Password tidak cocok"
        });
    }

    try {
        // Cek apakah email atau no telp sudah terdaftar
        const existingUser = await Users.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { phone: phone }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({
                msg: existingUser.email === email
                    ? "Email sudah terdaftar"
                    : "No Telp sudah digunakan"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        // Generate OTP
        const otpCode = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 menit dari sekarang

        console.log('Generated OTP for', email, ':', otpCode); // Debug log

        // Simpan ke database (belum verified)
        const newUser = await Users.create({
            name,
            phone,
            email,
            gender,
            password: hashPassword,
            otp_code: otpCode,
            otp_expires: otpExpires,
            is_verified: false // Belum verified
        });

        // Kirim OTP email
        try {
            await sendOTPEmail(email, name, otpCode);
            console.log('OTP email sent successfully to:', email);
        } catch (emailError) {
            console.error('Failed to send OTP email:', emailError);
            
            // Jika email gagal, hapus user yang baru dibuat
            await Users.destroy({ where: { id: newUser.id } });
            
            return res.status(500).json({
                msg: "Gagal mengirim email verifikasi. Silakan coba lagi.",
                debug: process.env.NODE_ENV === 'development' ? emailError.message : undefined
            });
        }

        // Buang password dan OTP dari response
        const { password: _, otp_code: __, ...userWithoutSensitiveData } = newUser.toJSON();

        res.status(201).json({
            msg: "Registrasi berhasil. Silakan cek email untuk kode verifikasi.",
            user: userWithoutSensitiveData,
            nextStep: "verify_otp"
        });

    } catch (error) {
        console.error("Registration error:", error);

        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                msg: "Data tidak valid",
                errors: error.errors.map(e => ({
                    field: e.path,
                    message: e.message
                }))
            });
        }

        res.status(500).json({
            msg: "Terjadi kesalahan server"
        });
    }
};

export const verifyOTP = async (req, res) => {
    const { email, otp_code } = req.body;

    // Validasi input
    if (!email || !otp_code) {
        return res.status(400).json({
            msg: "Email dan kode OTP harus diisi"
        });
    }

    try {
        // Cari user berdasarkan email
        const user = await Users.findOne({
            where: { email: email }
        });

        if (!user) {
            return res.status(404).json({
                msg: "User tidak ditemukan"
            });
        }

        // Cek apakah sudah verified
        if (user.is_verified) {
            return res.status(400).json({
                msg: "Email sudah terverifikasi. Silakan login."
            });
        }

        // Cek OTP
        if (user.otp_code !== otp_code) {
            return res.status(400).json({
                msg: "Kode OTP tidak valid"
            });
        }

        // Cek expiry
        if (new Date() > user.otp_expires) {
            return res.status(400).json({
                msg: "Kode OTP sudah expired. Silakan minta kode baru."
            });
        }

        // Update user menjadi verified
        await Users.update(
            {
                is_verified: true,
                email_verified_at: new Date(),
                otp_code: null, // Clear OTP
                otp_expires: null // Clear expiry
            },
            { where: { id: user.id } }
        );

        // Kirim welcome email
        try {
            await sendWelcomeEmail(email, user.name);
            console.log('Welcome email sent to:', email);
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Tidak perlu gagal, karena verifikasi sudah berhasil
        }

        // Generate tokens untuk auto-login
        const accessToken = jwt.sign(
            { userId: user.id, name: user.name, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { userId: user.id, name: user.name, email: user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Simpan refresh token
        await Users.update(
            { refresh_token: refreshToken },
            { where: { id: user.id } }
        );

        // Set refresh token ke cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 hari
        });

        res.status(200).json({
            msg: "Email berhasil diverifikasi! Selamat datang di Fishmap AI",
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                is_verified: true
            },
            autoLogin: true
        });

    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({
            msg: "Terjadi kesalahan server"
        });
    }
};

// ⭐ NEW: Resend OTP
export const resendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            msg: "Email harus diisi"
        });
    }

    try {
        // Cari user
        const user = await Users.findOne({
            where: { email: email }
        });

        if (!user) {
            return res.status(404).json({
                msg: "Email tidak ditemukan"
            });
        }

        if (user.is_verified) {
            return res.status(400).json({
                msg: "Email sudah terverifikasi"
            });
        }

        // Generate OTP baru
        const otpCode = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 menit

        // Update OTP di database
        await Users.update(
            {
                otp_code: otpCode,
                otp_expires: otpExpires
            },
            { where: { id: user.id } }
        );

        // Kirim OTP email
        try {
            await sendOTPEmail(email, user.name, otpCode);
            console.log('OTP resent successfully to:', email);
        } catch (emailError) {
            console.error('Failed to resend OTP email:', emailError);
            return res.status(500).json({
                msg: "Gagal mengirim ulang email verifikasi"
            });
        }

        res.status(200).json({
            msg: "Kode verifikasi berhasil dikirim ulang. Silakan cek email Anda."
        });

    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            msg: "Terjadi kesalahan server"
        });
    }
};

export const Login = async (req, res) => {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
        return res.status(400).json({ msg: "Email dan password harus diisi" });
    }

    try {
        // Cari user berdasarkan email
        const user = await Users.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ msg: "Email tidak ditemukan" });
        }

        // Cocokkan password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ msg: "Password salah" });
        }

        // Ambil data yang dibutuhkan untuk token
        const userId = user.id;
        const name = user.name;
        const userEmail = user.email;

        // Buat access token (misal 1 jam)
        const accessToken = jwt.sign(
            { userId, name, email: userEmail },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        // Buat refresh token (misal 1 hari)
        const refreshToken = jwt.sign(
            { userId, name, email: userEmail },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Simpan refresh token di database
        await Users.update(
            { refresh_token: refreshToken },
            { where: { id: userId } }
        );

        // Set refresh token ke cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // ⬅️ hanya jika HTTPS
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 hari
        });

        // Kirim access token dan info user
        res.status(200).json({
            msg: "Login berhasil",
            accessToken,
            user: {
                id: userId,
                name,
                email: userEmail
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
};


export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204); // No Content

    try {
        // ✅ Fix 1: Gunakan Users dan findOne()
        const user = await Users.findOne({
            where: {
                refresh_token: refreshToken
            }
        });

        // ✅ Fix 2: Cek user dengan benar
        if (!user) return res.sendStatus(204);

        // ✅ Fix 3: Langsung akses user.id (tanpa [0])
        const userId = user.id;

        // ✅ Fix 4: Gunakan Users konsisten
        await Users.update(
            { refresh_token: null },
            { where: { id: userId } }
        );

        res.clearCookie('refreshToken');
        res.json({ msg: "Logout berhasil" });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ msg: "Server error" });
    }
}