import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [validationError, setValidationError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const showPopup = (msg) => {
    setValidationError(msg);
    setTimeout(() => {
      setValidationError("");
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    
    // Custom Validation
    if (!email.trim()) {
      return showPopup("Alamat Email tidak boleh kosong.");
    }
    if (!password) {
      return showPopup("Kata Sandi tidak boleh kosong.");
    }

    setSubmitting(true);

    const result = await login(email, password);

    if (result.success) {
      const token = localStorage.getItem("AUTH_TOKEN");
      if (token) {
        try {
          setTimeout(() => {
            if (result.role === "Admin") {
              navigate("/admin/dashboard");
            } else {
              navigate("/");
            }
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
      <div className="w-full md:w-1/2 relative h-64 md:h-auto overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format" 
          alt="Canvas Space" 
          className="absolute inset-0 w-full h-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Right side: Form */}
      <div className="w-full md:w-1/2 flex flex-col p-8 pt-28 md:p-28 md:pt-32 relative overflow-y-auto max-h-screen">
        <div className="w-full max-w-md mx-auto my-auto">
          <Link to="/" className="text-[9px] uppercase tracking-widest font-bold mb-8 inline-block" style={{ color: "var(--color-text-primary)" }}>
            ← Kembali
          </Link>
          <h2 className="mb-2" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 3vw, 2.5rem)", lineHeight: 1.1 }}>
            Masuk ke Ruang Anda.
          </h2>
          <p className="mb-12 text-[11px] uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            Lanjutkan perjalanan Anda bersama Canvas Space
          </p>

          {errorMsg && (
            <div className="mb-8 p-4 text-[11px] font-bold uppercase tracking-wider" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", borderLeft: "2px solid #ef4444" }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate autoComplete="off">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[9px] font-bold uppercase tracking-widest">Alamat Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                className="bg-transparent border-b-2 py-3 outline-none text-sm transition-colors focus:border-black"
                style={{ borderColor: "var(--color-border-subtle)", color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-[9px] font-bold uppercase tracking-widest">Kata Sandi</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="bg-transparent border-b-2 py-3 outline-none text-sm transition-colors focus:border-black"
                style={{ borderColor: "var(--color-border-subtle)", color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}
              />
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
              {submitting ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="mt-12 text-[10px] uppercase tracking-widest text-center" style={{ color: "var(--color-text-muted)" }}>
            Belum punya akun? <Link to="/register" style={{ color: "var(--color-text-primary)", fontWeight: "bold", borderBottom: "1px solid var(--color-text-primary)" }}>Daftar di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
