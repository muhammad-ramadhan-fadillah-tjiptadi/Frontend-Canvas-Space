import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");
    setSubmitting(true);

    if (password !== passwordConfirm) {
      setErrors({ password: ["Konfirmasi kata sandi tidak cocok."] });
      setSubmitting(false);
      return;
    }

    const result = await register(name, email, password, passwordConfirm, phone, address);

    if (result.success) {
      setSuccessMsg("Registrasi berhasil! Mengalihkan ke halaman login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setErrors(result.errors || { general: [result.message] });
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Buat Akun Baru</h2>
        <p className="auth-subtitle">Daftar sekarang untuk mulai berbelanja furniture premium</p>

        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {errors.general && <div className="alert alert-danger">{errors.general[0]}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Nama Lengkap</label>
            <input
              type="text"
              id="name"
              placeholder="Budi Santoso"
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
              placeholder="budi@email.com"
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
              placeholder="08123456789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.no_telepon && <span className="input-error">{errors.no_telepon[0]}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Alamat Lengkap</label>
            <textarea
              id="address"
              placeholder="Jl. Raya No. 12, Jakarta"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows="2"
            />
            {errors.alamat && <span className="input-error">{errors.alamat[0]}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Kata Sandi</label>
            <input
              type="password"
              id="password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <span className="input-error">{errors.password[0]}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="passwordConfirm">Konfirmasi Kata Sandi</label>
            <input
              type="password"
              id="passwordConfirm"
              placeholder="Ulangi kata sandi"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={submitting}>
            {submitting ? "Mendaftarkan..." : "Daftar Akun"}
          </button>
        </form>

        <p className="auth-footer">
          Sudah punya akun? <Link to="/login">Masuk disini</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
