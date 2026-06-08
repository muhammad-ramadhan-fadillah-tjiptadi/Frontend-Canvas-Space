import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Tutup sidebar otomatis saat navigasi berubah (user klik link)
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Tutup sidebar saat klik di luar (backdrop)
  const handleBackdropClick = () => setMobileOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Pesanan",   path: "/admin/pesanan"   },
    { name: "Produk",    path: "/admin/produk"     },
    { name: "Kategori",  path: "/admin/kategori"   },
  ];

  const SidebarContent = () => (
    <div
      className="flex flex-col justify-between"
      style={{ height: "100%", minHeight: "100vh", background: "#000", color: "#fff" }}
    >
      {/* Top: Logo + Nav */}
      <div className="p-8">
        {/* Tombol tutup — hanya di mobile */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden mb-8 text-[9px] uppercase tracking-widest font-bold"
          style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.2em" }}
          aria-label="Tutup menu admin"
        >
          ✕ Tutup
        </button>

        <Link to="/admin/dashboard" className="block mb-12">
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.5rem",
              lineHeight: 1,
              textTransform: "uppercase",
              color: "#fff",
            }}
          >
            Canvas<br />Space.<br />
            <span
              style={{
                fontSize: "0.5rem",
                fontFamily: "var(--font-sans)",
                letterSpacing: "0.2em",
                display: "block",
                marginTop: "1rem",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              ADMIN PANEL
            </span>
          </h1>
        </Link>

        <nav className="flex flex-col gap-4">
          {navItems.map((item) => {
            const isActive =
              location.pathname.startsWith(item.path) ||
              (item.path === "/admin/dashboard" && location.pathname === "/admin");
            return (
              <Link
                key={item.path}
                to={item.path}
                className="text-[10px] uppercase tracking-widest font-bold transition-all p-3"
                style={{
                  color: isActive ? "#000" : "#fff",
                  background: isActive ? "#fff" : "transparent",
                  border: "1px solid #fff",
                  boxShadow: isActive ? "4px 4px 0 rgba(255,255,255,0.2)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.color = "#000";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#fff";
                  }
                }}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Logout */}
      <div className="p-8 border-t" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
        <button
          onClick={handleLogout}
          className="text-[10px] uppercase tracking-widest font-bold w-full text-left transition-opacity hover:opacity-70"
          style={{ color: "#ef4444" }}
        >
          ← KELUAR
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── MOBILE: Topbar dengan hamburger ── */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6"
        style={{ height: "56px", background: "#000", borderBottom: "1px solid rgba(255,255,255,0.15)" }}
      >
        {/* Logo kecil di topbar */}
        <Link to="/admin/dashboard">
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1rem",
              textTransform: "uppercase",
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            Canvas Space
          </span>
        </Link>

        {/* Hamburger button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="flex flex-col justify-center items-end gap-[5px] p-2"
          aria-label="Buka menu admin"
          style={{ minWidth: "44px", minHeight: "44px" }}
        >
          <span style={{ display: "block", width: "20px", height: "1.5px", background: "#fff" }} />
          <span style={{ display: "block", width: "14px", height: "1.5px", background: "#fff" }} />
          <span style={{ display: "block", width: "20px", height: "1.5px", background: "#fff" }} />
        </button>
      </div>

      {/* ── MOBILE: Offset untuk topbar ── */}
      <div className="md:hidden" style={{ height: "56px" }} />

      {/* ── MOBILE: Backdrop overlay ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      {/* ── MOBILE: Sidebar drawer (slide in dari kiri) ── */}
      <div
        className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-72"
        style={{
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowY: "auto",
        }}
      >
        <SidebarContent />
      </div>

      {/* ── DESKTOP: Sidebar statis (selalu tampil) ── */}
      <div
        className="hidden md:flex flex-shrink-0 flex-col"
        style={{
          width: "256px",
          borderRight: "1px solid #333",
          minHeight: "100vh",
          position: "sticky",
          top: 0,
          alignSelf: "flex-start",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <SidebarContent />
      </div>
    </>
  );
};

export default AdminSidebar;
