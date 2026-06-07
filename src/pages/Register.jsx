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
  const [validationError, setValidationError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const showPopup = (msg) => {
    setValidationError(msg);
    setTimeout(() => {
      setValidationError("");
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");
    setValidationError("");
    
    // Custom Validation Empty Fields
    if (!name.trim()) return showPopup("Nama Lengkap tidak boleh kosong.");
    if (!phone.trim()) return showPopup("Nomor Telepon tidak boleh kosong.");
    if (!email.trim()) return showPopup("Alamat Email tidak boleh kosong.");
    if (!address.trim()) return showPopup("Alamat Lengkap tidak boleh kosong.");
    if (!password) return showPopup("Kata Sandi tidak boleh kosong.");
    if (!passwordConfirm) return showPopup("Konfirmasi Sandi tidak boleh kosong.");

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
    <div className="min-h-screen flex flex-col md:flex-row relative" style={{ background: "var(--color-bg-base)", color: "var(--color-text-primary)" }}>
      
      {/* Custom Popup Toast */}
      <div 
        className={`fixed top-8 right-8 z-50 transition-all duration-500 transform ${validationError ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}
      >
        <div className="px-6 py-4 flex items-center gap-4" style={{ background: "var(--color-bg-base)", border: "1px solid var(--color-text-primary)", boxShadow: "4px 4px 0 var(--color-text-primary)" }}>
          <span style={{ color: "#ef4444", fontSize: "12px" }}>■</span>
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--color-text-primary)" }}>
            {validationError}
          </span>
          <button onClick={() => setValidationError("")} className="ml-4 text-[10px] font-bold transition-transform hover:scale-110" style={{ color: "var(--color-text-primary)" }}>✕</button>
        </div>
      </div>

      {/* Left side: Image */}
      <div className="w-full md:w-1/2 relative h-64 md:h-auto overflow-hidden md:order-2">
        <img 
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format" 
          alt="Canvas Space" 
          className="absolute inset-0 w-full h-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Right side: Form */}
      <div className="w-full md:w-1/2 flex flex-col p-8 pt-28 md:p-12 md:pt-32 relative md:order-1 overflow-y-auto max-h-screen">
        <div className="w-full max-w-md mx-auto my-auto pb-10">
          <Link to="/" className="text-[9px] uppercase tracking-widest font-bold mb-8 inline-block" style={{ color: "var(--color-text-primary)" }}>
            ← Kembali
          </Link>
          <h2 className="mb-2" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 3vw, 2.5rem)", lineHeight: 1.1 }}>
            Menjadi Bagian.
          </h2>
          <p className="mb-10 text-[11px] uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            Daftar untuk koleksi premium
          </p>

          {successMsg && (
            <div className="mb-6 p-4 text-[11px] font-bold uppercase tracking-wider" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", borderLeft: "2px solid #10b981" }}>
              {successMsg}
            </div>
          )}
          {errors.general && (
            <div className="mb-6 p-4 text-[11px] font-bold uppercase tracking-wider" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", borderLeft: "2px solid #ef4444" }}>
              {errors.general[0]}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-[9px] font-bold uppercase tracking-widest">Nama Lengkap</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                  className="bg-transparent border-b-2 py-2 outline-none text-sm transition-colors focus:border-black"
                  style={{ borderColor: "var(--color-border-subtle)", color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}
                />
                {errors.nama && <span className="text-[9px] text-red-500 font-bold uppercase mt-1">{errors.nama[0]}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="text-[9px] font-bold uppercase tracking-widest">Nomor Telepon</label>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="off"
                  className="bg-transparent border-b-2 py-2 outline-none text-sm transition-colors focus:border-black"
                  style={{ borderColor: "var(--color-border-subtle)", color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}
                />
                {errors.no_telepon && <span className="text-[9px] text-red-500 font-bold uppercase mt-1">{errors.no_telepon[0]}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[9px] font-bold uppercase tracking-widest">Alamat Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                className="bg-transparent border-b-2 py-2 outline-none text-sm transition-colors focus:border-black"
                style={{ borderColor: "var(--color-border-subtle)", color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}
              />
              {errors.email && <span className="text-[9px] text-red-500 font-bold uppercase mt-1">{errors.email[0]}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="address" className="text-[9px] font-bold uppercase tracking-widest">Alamat Lengkap</label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                autoComplete="off"
                rows="2"
                className="bg-transparent border-b-2 py-2 outline-none text-sm transition-colors focus:border-black resize-none"
                style={{ borderColor: "var(--color-border-subtle)", color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}
              />
              {errors.alamat && <span className="text-[9px] text-red-500 font-bold uppercase mt-1">{errors.alamat[0]}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-[9px] font-bold uppercase tracking-widest">Kata Sandi</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="bg-transparent border-b-2 py-2 outline-none text-sm transition-colors focus:border-black"
                  style={{ borderColor: "var(--color-border-subtle)", color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}
                />
                {errors.password && <span className="text-[9px] text-red-500 font-bold uppercase mt-1">{errors.password[0]}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="passwordConfirm" className="text-[9px] font-bold uppercase tracking-widest">Konfirmasi Sandi</label>
                <input
                  type="password"
                  id="passwordConfirm"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  autoComplete="new-password"
                  className="bg-transparent border-b-2 py-2 outline-none text-sm transition-colors focus:border-black"
                  style={{ borderColor: "var(--color-border-subtle)", color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="mt-6 w-full py-5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer"
              style={{
                background: "var(--color-text-primary)",
                color: "var(--color-text-inverted)",
                opacity: submitting ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if(!submitting) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--color-text-primary)";
                  e.currentTarget.style.boxShadow = "inset 0 0 0 1px var(--color-text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if(!submitting) {
                  e.currentTarget.style.background = "var(--color-text-primary)";
                  e.currentTarget.style.color = "var(--color-text-inverted)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {submitting ? "Mendaftarkan..." : "Daftar Akun"}
            </button>
          </form>

          <p className="mt-10 text-[10px] uppercase tracking-widest text-center" style={{ color: "var(--color-text-muted)" }}>
            Sudah punya akun? <Link to="/login" style={{ color: "var(--color-text-primary)", fontWeight: "bold", borderBottom: "1px solid var(--color-text-primary)" }}>Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
