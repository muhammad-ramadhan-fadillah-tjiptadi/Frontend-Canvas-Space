import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    const result = await login(email, password);

    if (result.success) {
      // Login berhasil, arahkan sesuai role
      // Ambil user terbaru untuk cek role
      const token = localStorage.getItem("AUTH_TOKEN");
      if (token) {
        try {
          // Token tersimpan, biarkan useEffect di AuthContext yang meload
          // Tapi kita bisa langsung redirect berdasarkan data dari backend
          // Di API response login, ada: user: { role: 'Admin' / 'Pelanggan' }
          // Kita bisa cek role melalui auth context sesaat setelah diset, atau sekadar decode token.
          // Tapi karena login set state async, kita decode dari storage / membiarkan check state.
          // Mari tunggu 100ms agar state tersinkronisasi atau langsung arahkan ke halaman utama.
          setTimeout(() => {
            navigate("/");
          }, 100);
        } catch (err) {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    } else {
      setErrorMsg(result.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Selamat Datang Kembali</h2>
        <p className="auth-subtitle">Masuk untuk melanjutkan belanja di Canvas Space</p>

        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Alamat Email</label>
            <input
              type="email"
              id="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Kata Sandi</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={submitting}>
            {submitting ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="auth-footer">
          Belum punya akun? <Link to="/register">Daftar Sekarang</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
