import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Profil = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Set initial data dari auth state
  useEffect(() => {
    if (user) {
      setName(user.nama || "");
      setEmail(user.email || "");
      setPhone(user.no_telepon || "");
      setAddress(user.alamat || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");
    setSubmitting(true);

    if (password && password !== passwordConfirm) {
      setErrors({ password: ["Konfirmasi kata sandi baru tidak cocok."] });
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        nama: name,
        email: email,
        no_telepon: phone,
        alamat: address,
      };

      if (password) {
        payload.password = password;
        payload.password_confirmation = passwordConfirm;
      }

      const response = await api.put("/me", payload);
      
      // Update global context state dengan data user terbaru dari respons
      setUser(response.data.user);
      setSuccessMsg("Profil Anda berhasil diperbarui!");
      setPassword("");
      setPasswordConfirm("");
    } catch (error) {
      setErrors(error.response?.data?.errors || { general: [error.response?.data?.message || "Gagal memperbarui profil."] });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2>Pengaturan Profil</h2>
        <p className="profile-subtitle">Perbarui data diri dan kata sandi akun Anda</p>

        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {errors.general && <div className="alert alert-danger">{errors.general[0]}</div>}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-section">
            <h3>Informasi Diri</h3>
            
            <div className="form-group">
              <label htmlFor="name">Nama Lengkap</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {errors.nama && <span className="input-error">{errors.nama[0]}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Alamat Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && <span className="input-error">{errors.email[0]}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Nomor Telepon</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.no_telepon && <span className="input-error">{errors.no_telepon[0]}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="address">Alamat Pengiriman Utama</label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows="3"
              />
              {errors.alamat && <span className="input-error">{errors.alamat[0]}</span>}
            </div>
          </div>

          <div className="profile-section">
            <h3>Ganti Kata Sandi (Opsional)</h3>
            <p className="section-instruction">Biarkan kosong jika Anda tidak ingin mengganti kata sandi.</p>

            <div className="form-group">
              <label htmlFor="password">Kata Sandi Baru</label>
              <input
                type="password"
                id="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <span className="input-error">{errors.password[0]}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="passwordConfirm">Konfirmasi Kata Sandi Baru</label>
              <input
                type="password"
                id="passwordConfirm"
                placeholder="Ulangi kata sandi baru"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="save-profile-btn" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profil;
