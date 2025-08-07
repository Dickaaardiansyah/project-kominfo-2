// services/emailService.js
import nodemailer from 'nodemailer';

// Setup transporter untuk Gmail
const createTransporter = () => {
  // Validate environment variables
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.error('❌ Missing email credentials in environment variables');
    console.log('Required env vars: EMAIL_USER, EMAIL_PASS');
    throw new Error('Email credentials not configured');
  }

  console.log('🔧 Creating email transporter for:', emailUser);

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    },
    // Additional configuration for better reliability
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Generate 6-digit OTP
export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('🔑 Generated OTP:', otp); // Debug log (remove in production)
  return otp;
};

// Test email connection
export const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email service connection successful');
    return { success: true };
  } catch (error) {
    console.error('❌ Email service connection failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Kirim OTP via email
export const sendOTPEmail = async (email, name, otpCode) => {
  try {
    console.log('📧 Attempting to send OTP email to:', email);
    
    // Validate inputs
    if (!email || !name || !otpCode) {
      throw new Error('Missing required parameters: email, name, or otpCode');
    }

    const transporter = createTransporter();

    // Test connection first
    console.log('🔄 Testing email connection...');
    await transporter.verify();
    console.log('✅ Email connection verified');

    const mailOptions = {
      from: {
        name: 'Fishmap AI',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: '🐟 Kode Verifikasi Fishmap AI',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container {
              max-width: 600px;
              margin: 0 auto;
              font-family: Arial, sans-serif;
              background-color: #f8f9fa;
              padding: 20px;
            }
            .card {
              background: white;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #4a90e2;
              margin-bottom: 10px;
            }
            .otp-code {
              background: #f0f8ff;
              border: 2px solid #4a90e2;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 20px 0;
            }
            .code {
              font-size: 36px;
              font-weight: bold;
              color: #4a90e2;
              letter-spacing: 5px;
              margin: 10px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="header">
                <div class="logo">🐟 Fishmap AI</div>
                <h2>Verifikasi Email Anda</h2>
              </div>
              
              <p>Halo <strong>${name}</strong>,</p>
              
              <p>Terima kasih telah mendaftar di Fishmap AI! Untuk melengkapi registrasi Anda, silakan masukkan kode verifikasi berikut:</p>
              
              <div class="otp-code">
                <div>Kode Verifikasi Anda:</div>
                <div class="code">${otpCode}</div>
                <div style="font-size: 14px; color: #666;">
                  Kode berlaku selama 10 menit
                </div>
              </div>
              
              <p>Jika Anda tidak meminta kode ini, abaikan email ini.</p>
              
              <div style="margin-top: 20px;">
                <strong>Tips keamanan:</strong>
                <ul style="color: #666; font-size: 14px;">
                  <li>Jangan bagikan kode ini kepada siapa pun</li>
                  <li>Tim Fishmap AI tidak akan pernah meminta kode verifikasi via telepon</li>
                </ul>
              </div>
              
              <div class="footer">
                <p>Email ini dikirim secara otomatis, mohon tidak membalas.</p>
                <p>&copy; 2025 Fishmap AI. Semua hak dilindungi.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    console.log('📤 Sending email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📨 Accepted:', result.accepted);
    
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    
    // Detailed error logging
    if (error.code === 'EAUTH') {
      console.error('🔐 Authentication failed - check EMAIL_USER and EMAIL_PASS');
    } else if (error.code === 'ENOTFOUND') {
      console.error('🌐 Network error - check internet connection');
    } else if (error.responseCode === 550) {
      console.error('📧 Invalid email address:', email);
    }
    
    throw error;
  }
};

// Kirim welcome email setelah verifikasi berhasil
export const sendWelcomeEmail = async (email, name) => {
  try {
    console.log('🎉 Sending welcome email to:', email);
    
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: 'Fishmap AI',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: '🎉 Selamat Datang di Fishmap AI!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container {
              max-width: 600px;
              margin: 0 auto;
              font-family: Arial, sans-serif;
              background-color: #f8f9fa;
              padding: 20px;
            }
            .card {
              background: white;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #4a90e2;
              margin-bottom: 10px;
            }
            .welcome-banner {
              background: linear-gradient(135deg, #4a90e2, #357abd);
              color: white;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 20px 0;
            }
            .feature-list {
              margin: 20px 0;
            }
            .feature-item {
              display: flex;
              align-items: center;
              margin: 10px 0;
              padding: 10px;
              background: #f8f9fa;
              border-radius: 5px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="header">
                <div class="logo">🐟 Fishmap AI</div>
              </div>
              
              <div class="welcome-banner">
                <h2>Selamat Datang, ${name}! 🎉</h2>
                <p>Akun Anda telah berhasil diverifikasi</p>
              </div>
              
              <p>Halo <strong>${name}</strong>,</p>
              
              <p>Selamat! Email Anda telah berhasil diverifikasi dan akun Fishmap AI Anda sudah aktif. Sekarang Anda dapat menikmati semua fitur yang tersedia:</p>
              
              <div class="feature-list">
                <div class="feature-item">
                  <span style="margin-right: 10px;">📸</span>
                  <span>Scan dan identifikasi ikan dengan AI</span>
                </div>
                <div class="feature-item">
                  <span style="margin-right: 10px;">📚</span>
                  <span>Buat katalog ikan pribadi Anda</span>
                </div>
                <div class="feature-item">
                  <span style="margin-right: 10px;">🌊</span>
                  <span>Akses informasi cuaca dan kondisi laut</span>
                </div>
                <div class="feature-item">
                  <span style="margin-right: 10px;">📊</span>
                  <span>Analisis hasil tangkapan Anda</span>
                </div>
              </div>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/login" 
                   style="background: #4a90e2; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Login Sekarang
                </a>
              </p>
              
              <p>Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi tim support kami.</p>
              
              <div class="footer">
                <p>Terima kasih telah bergabung dengan Fishmap AI!</p>
                <p>&copy; 2025 Fishmap AI. Semua hak dilindungi.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    throw error;
  }
};