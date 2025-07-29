import Users from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';


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

        // Simpan ke database
        const newUser = await Users.create({
            name,
            phone,
            email,
            gender,
            password: hashPassword,
        });

        // Buang password dari response
        const { password: _, ...userWithoutPassword } = newUser.toJSON();

        res.status(201).json({
            msg: "Registrasi berhasil",
            data: userWithoutPassword
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

// Helper function untuk calculate calories
// function calculateCalories({ height, currentWeight, age, gender, activityLevel, weeklyTarget }) {
//     const weight = parseFloat(currentWeight);
//     const heightCm = parseFloat(height);
//     const ageNum = parseInt(age);
//     const activity = parseFloat(activityLevel);
//     const target = parseFloat(weeklyTarget);

//     // Mifflin-St Jeor Equation
//     let bmr;
//     if (gender === 'male') {
//         bmr = (10 * weight) + (6.25 * heightCm) - (5 * ageNum) + 5;
//     } else {
//         bmr = (10 * weight) + (6.25 * heightCm) - (5 * ageNum) - 161;
//     }

//     const tdee = bmr * activity;
//     const weeklyDeficit = target * 7700;
//     const dailyDeficit = weeklyDeficit / 7;
//     const targetCalories = tdee - dailyDeficit;
//     const minCalories = gender === 'male' ? 1500 : 1200;

//     return Math.max(Math.round(targetCalories), minCalories);
// }

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