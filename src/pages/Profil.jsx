import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
      
      setUser(response.data.user);
      setSuccessMsg("Profil Anda berhasil diperbarui.");
      setPassword("");
      setPasswordConfirm("");
    } catch (error) {
      setErrors(error.response?.data?.errors || { general: [error.response?.data?.message || "Gagal memperbarui profil."] });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 md:px-12 lg:px-24" style={{ background: "var(--color-bg-base)", color: "var(--color-text-primary)" }}>
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-[9px] uppercase tracking-widest font-bold mb-12 inline-block" style={{ color: "var(--color-text-primary)" }}>
          ← Eksplorasi
        </Link>
        
        <h1 className="mb-12" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 4vw, 4rem)", lineHeight: 1.1, textTransform: "uppercase" }}>
          Pengaturan<br/>Profil.
        </h1>

        {/* Notifikasi */}
        {successMsg && (
          <div className="mb-8 px-6 py-4 flex items-center gap-4" style={{ border: "1px solid #10b981", boxShadow: "4px 4px 0 #10b981", background: "#fff" }}>
            <span style={{ color: "#10b981", fontSize: "12px" }}>■</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
              {successMsg}
            </span>
          </div>
        )}
        
        {errors.general && (
          <div className="mb-8 px-6 py-4 flex items-center gap-4" style={{ border: "1px solid #ef4444", boxShadow: "4px 4px 0 #ef4444", background: "#fff" }}>
            <span style={{ color: "#ef4444", fontSize: "12px" }}>■</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">
              {errors.general[0]}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-16">
          
          {/* Identitas */}
          <div className="flex flex-col gap-8">
            <div className="flex items-end gap-4 border-b pb-4" style={{ borderColor: "var(--color-border-subtle)" }}>
              <span className="text-2xl font-light" style={{ fontFamily: "var(--font-serif)" }}>01</span>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Informasi Diri</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label htmlFor="name" className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>Nama Lengkap</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent outline-none p-4 transition-all"
                  style={{ border: "1px solid var(--color-border-subtle)", fontFamily: "var(--font-mono)", fontSize: "13px" }}
                  onFocus={(e) => e.target.style.border = "1px solid var(--color-text-primary)"}
                  onBlur={(e) => e.target.style.border = "1px solid var(--color-border-subtle)"}
                  required
                />
                {errors.nama && <span className="text-[9px] text-red-500 uppercase tracking-widest mt-1">{errors.nama[0]}</span>}
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="email" className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>Alamat Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent outline-none p-4 transition-all"
                  style={{ border: "1px solid var(--color-border-subtle)", fontFamily: "var(--font-mono)", fontSize: "13px" }}
                  onFocus={(e) => e.target.style.border = "1px solid var(--color-text-primary)"}
                  onBlur={(e) => e.target.style.border = "1px solid var(--color-border-subtle)"}
                  required
                />
                {errors.email && <span className="text-[9px] text-red-500 uppercase tracking-widest mt-1">{errors.email[0]}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label htmlFor="phone" className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>Nomor Telepon</label>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent outline-none p-4 transition-all"
                  style={{ border: "1px solid var(--color-border-subtle)", fontFamily: "var(--font-mono)", fontSize: "13px" }}
                  onFocus={(e) => e.target.style.border = "1px solid var(--color-text-primary)"}
                  onBlur={(e) => e.target.style.border = "1px solid var(--color-border-subtle)"}
                />
                {errors.no_telepon && <span className="text-[9px] text-red-500 uppercase tracking-widest mt-1">{errors.no_telepon[0]}</span>}
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="address" className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>Alamat Pengiriman Utama</label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows="3"
                  className="w-full bg-transparent outline-none p-4 resize-none transition-all"
                  style={{ border: "1px solid var(--color-border-subtle)", fontFamily: "var(--font-mono)", fontSize: "13px" }}
                  onFocus={(e) => e.target.style.border = "1px solid var(--color-text-primary)"}
                  onBlur={(e) => e.target.style.border = "1px solid var(--color-border-subtle)"}
                />
                {errors.alamat && <span className="text-[9px] text-red-500 uppercase tracking-widest mt-1">{errors.alamat[0]}</span>}
              </div>
            </div>
          </div>

          {/* Keamanan */}
          <div className="flex flex-col gap-8">
            <div className="flex items-end gap-4 border-b pb-4" style={{ borderColor: "var(--color-border-subtle)" }}>
              <span className="text-2xl font-light" style={{ fontFamily: "var(--font-serif)" }}>02</span>
              <div className="flex flex-col gap-1">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Ganti Kata Sandi</h3>
                <span className="text-[9px] uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Opsional - Kosongkan jika tidak diganti</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label htmlFor="password" className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>Kata Sandi Baru</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent outline-none p-4 transition-all"
                  style={{ border: "1px solid var(--color-border-subtle)", fontFamily: "var(--font-mono)", fontSize: "13px" }}
                  onFocus={(e) => e.target.style.border = "1px solid var(--color-text-primary)"}
                  onBlur={(e) => e.target.style.border = "1px solid var(--color-border-subtle)"}
                />
                {errors.password && <span className="text-[9px] text-red-500 uppercase tracking-widest mt-1">{errors.password[0]}</span>}
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="passwordConfirm" className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>Konfirmasi Sandi Baru</label>
                <input
                  type="password"
                  id="passwordConfirm"
                  placeholder="Ulangi kata sandi baru"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full bg-transparent outline-none p-4 transition-all"
                  style={{ border: "1px solid var(--color-border-subtle)", fontFamily: "var(--font-mono)", fontSize: "13px" }}
                  onFocus={(e) => e.target.style.border = "1px solid var(--color-text-primary)"}
                  onBlur={(e) => e.target.style.border = "1px solid var(--color-border-subtle)"}
                />
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="pt-8 border-t" style={{ borderColor: "var(--color-text-primary)" }}>
            <button 
              type="submit" 
              disabled={submitting}
              className="w-full md:w-auto px-12 py-5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer"
              style={{
                background: submitting ? "var(--color-border-subtle)" : "var(--color-text-primary)",
                color: submitting ? "var(--color-text-muted)" : "var(--color-text-inverted)",
                border: submitting ? "none" : "1px solid var(--color-text-primary)",
              }}
              onMouseEnter={(e) => {
                if(!submitting){
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--color-text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if(!submitting){
                  e.currentTarget.style.background = "var(--color-text-primary)";
                  e.currentTarget.style.color = "var(--color-text-inverted)";
                }
              }}
            >
              {submitting ? "Menyimpan Data..." : "Simpan Perubahan"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Profil;
