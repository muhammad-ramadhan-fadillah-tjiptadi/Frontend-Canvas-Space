import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("AUTH_TOKEN") || null);
  const [loading, setLoading] = useState(true);

  // Cek token saat aplikasi dibuka / direfresh
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          // api.js otomatis menyisipkan token via request interceptor
          const response = await api.get("/me");
          setUser(response.data);
        } catch (error) {
          console.error("Token tidak valid atau kedaluwarsa:", error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  // Fungsi Login
  const login = async (email, password) => {
    try {
      const response = await api.post("/login", { email, password });
      const { access_token, user: userData } = response.data;

      localStorage.setItem("AUTH_TOKEN", access_token);
      setToken(access_token);
      setUser(userData);
      return { success: true, role: userData.role };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login gagal!",
      };
    }
  };

  // Fungsi Register
  const register = async (name, email, password, passwordConfirmation, phone, address) => {
    try {
      const response = await api.post("/register", {
        nama: name,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
        no_telepon: phone,
        alamat: address,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: "Registrasi gagal!",
        errors: error.response?.data?.errors || {},
      };
    }
  };

  // Fungsi Logout
  const logout = async () => {
    try {
      if (token) {
        await api.post("/logout");
      }
    } catch (error) {
      console.error("Gagal melakukan logout di server:", error);
    } finally {
      localStorage.removeItem("AUTH_TOKEN");
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
