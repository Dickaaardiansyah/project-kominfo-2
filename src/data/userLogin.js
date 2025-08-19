import CONFIG from '../config/config';

const ENDPOINTS = {
  USER_LOGIN: `${CONFIG.BASE_URL}/login`,
};

// Login User Function
export async function loginUser({ email, password }) {
  try {
    console.log('Attempting login with:', { email });

    const response = await fetch(ENDPOINTS.USER_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    console.log('Login response status:', response.status);

    const data = await response.json();
    console.log('Login response data:', data);

    if (response.ok && data.accessToken) {
      // Login berhasil
      console.log('Login successful!');
      
      // Simpan data ke localStorage
      localStorage.setItem('token', data.accessToken);
      
      // Simpan user data jika ada
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userId', data.user.id);
      }

      return {
        success: true,
        accessToken: data.accessToken,
        user: data.user,
        message: data.msg || 'Login berhasil!'
      };

    } else {
      // Login gagal
      return {
        success: false,
        message: data.msg || data.message || 'Login gagal'
      };
    }

  } catch (error) {
    console.error('Login error:', error);
    
    // Handle different types of errors
    let errorMessage;
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      errorMessage = 'Gagal terhubung ke server. Pastikan server berjalan di localhost:5000';
    } else if (error.message.includes('401') || error.message.includes('Wrong')) {
      errorMessage = 'Email atau password salah';
    } else if (error.message.includes('404') || error.message.includes('User not found')) {
      errorMessage = 'Email tidak terdaftar';
    } else {
      errorMessage = error.message || 'Terjadi kesalahan saat login';
    }

    return {
      success: false,
      message: errorMessage
    };
  }
}