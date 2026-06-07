import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../hooks/useCart";

/* ── History SVG Icon ─────────────────────────────────────────────────── */
const HistoryIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

/* ── User SVG Icon ────────────────────────────────────────────────────── */
const UserIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

/* ── Cart SVG Icon ─────────────────────────────────────────────────────── */
const CartIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

/* ── Hamburger / Close ─────────────────────────────────────────────────── */
const MenuIcon = ({ open }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    aria-hidden="true"
  >
    {open ? (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ) : (
      <>
        <line x1="4" y1="8" x2="20" y2="8" />
        <line x1="4" y1="16" x2="20" y2="16" />
      </>
    )}
  </svg>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
    navigate("/login");
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.kuantitas, 0);

  const navStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    background: "rgba(30, 28, 26, 0.95)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  };

  const linkStyle = {
    fontFamily: "var(--font-sans)",
    fontSize: "0.65rem",
    fontWeight: 600,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.6)",
    transition: "color 0.2s ease",
    cursor: "pointer",
  };

  return (
    <>
      <nav style={navStyle} aria-label="Navigasi utama">
        <div
          className="flex justify-between items-center"
          style={{ maxWidth: "88rem", margin: "0 auto", padding: "1rem 2rem" }}
        >
          {/* ── Logo ── */}
          <Link
            to="/"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.15rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: "var(--color-text-inverted)",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            Canvas Space
          </Link>

          {/* ── Desktop Nav Links ── */}
          <ul
            className="hidden md:flex items-center gap-10"
            style={{ listStyle: "none", margin: 0, padding: 0 }}
          >
            {user?.role === "Admin" && (
              <>
                {[
                  { to: "/admin/pesanan", label: "Pesanan" },
                  { to: "/admin/produk", label: "Produk" },
                  { to: "/admin/kategori", label: "Kategori" },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      style={linkStyle}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color =
                          "var(--color-text-inverted)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color =
                          "rgba(255,255,255,0.6)")
                      }
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </>
            )}
            {/* Pelanggan text links removed and converted to icons */}
          </ul>

          {/* ── Right Side ── */}
          <div className="flex items-center gap-6">
            
            {/* Icon Group: Riwayat, Profil, Cart */}
            <div className="flex items-center gap-4">
              {user?.role === "Pelanggan" && (
                <>
                  <Link
                    to="/riwayat"
                    className="relative flex items-center justify-center hidden md:flex"
                    style={{
                      width: "2.25rem",
                      height: "2.25rem",
                      color: "rgba(255,255,255,0.6)",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-inverted)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                    aria-label="Riwayat Belanja"
                    title="Riwayat Belanja"
                  >
                    <HistoryIcon />
                  </Link>

                  <Link
                    to="/profil"
                    className="relative flex items-center justify-center hidden md:flex"
                    style={{
                      width: "2.25rem",
                      height: "2.25rem",
                      color: "rgba(255,255,255,0.6)",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-inverted)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                    aria-label="Profil Saya"
                    title="Profil Saya"
                  >
                    <UserIcon />
                  </Link>
                </>
              )}

              {/* Cart - Visible to guests and Pelanggan */}
              {user?.role !== "Admin" && (
                <Link
                  to="/cart"
                  className="relative flex items-center justify-center"
                  style={{
                    width: "2.25rem",
                    height: "2.25rem",
                    color: "rgba(255,255,255,0.6)",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--color-text-inverted)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(255,255,255,0.6)")
                  }
                  aria-label={`Keranjang — ${cartItemCount} item`}
                  title="Keranjang Belanja"
                >
                  <CartIcon />
                  {cartItemCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 flex items-center justify-center text-white"
                      style={{
                        width: "1.1rem",
                        height: "1.1rem",
                        borderRadius: "50%",
                        background: "var(--color-accent)",
                        fontSize: "0.45rem",
                        fontWeight: 700,
                        letterSpacing: 0,
                        boxShadow: "0 0 0 2px var(--color-text-primary)",
                      }}
                      aria-hidden="true"
                    >
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              )}
            </div>

            {user ? (
              <div className="hidden md:flex items-center gap-6">
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.2em]"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  HALO, {user.nama ? user.nama.split(" ")[0] : "USER"}
                </span>

                <button
                  onClick={handleLogout}
                  className="cursor-pointer transition-colors duration-200"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.6)",
                    background: "none",
                    border: "none",
                    padding: 0,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#ef4444")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(255,255,255,0.6)")
                  }
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-6">
                <Link
                  to="/login"
                  style={linkStyle}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--color-text-inverted)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color =
                      "rgba(255,255,255,0.6)")
                  }
                >
                  Masuk
                </Link>
                  <Link
                  to="/register"
                  className="transition-colors duration-200"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "var(--color-text-primary)",
                    background: "var(--color-text-inverted)",
                    padding: "0.6rem 1.4rem",
                    display: "inline-block",
                    border: "1px solid var(--color-text-inverted)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--color-text-inverted)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "var(--color-text-inverted)";
                    e.currentTarget.style.color = "var(--color-text-primary)";
                  }}
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={mobileOpen}
              style={{
                color: "var(--color-text-inverted)",
                background: "none",
                border: "none",
                padding: "0.25rem",
              }}
            >
              <MenuIcon open={mobileOpen} />
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <div
          style={{
            overflow: "hidden",
            maxHeight: mobileOpen ? "400px" : "0",
            transition: "max-height 0.35s var(--ease-smooth)",
            background: "rgba(30, 28, 26, 0.98)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: mobileOpen
              ? "1px solid rgba(255,255,255,0.05)"
              : "1px solid transparent",
          }}
        >
          <div style={{ padding: "1.5rem 2rem 2rem" }}>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {user?.role === "Admin" &&
                [
                  { to: "/admin/pesanan", label: "Pesanan Masuk" },
                  { to: "/admin/produk", label: "Produk Admin" },
                  { to: "/admin/kategori", label: "Kategori Admin" },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      style={{ ...linkStyle, fontSize: "0.75rem" }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}

              {user?.role === "Pelanggan" &&
                [
                  { to: "/riwayat", label: "Riwayat Belanja" },
                  { to: "/profil", label: "Profil Saya" },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      style={{ ...linkStyle, fontSize: "0.75rem" }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}

              {!user && (
                <>
                  <li>
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      style={{
                        ...linkStyle,
                        fontSize: "0.75rem",
                        color: "var(--color-text-inverted)",
                      }}
                    >
                      Masuk
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      style={{
                        ...linkStyle,
                        fontSize: "0.75rem",
                        color: "var(--color-text-inverted)",
                      }}
                    >
                      Daftar
                    </Link>
                  </li>
                </>
              )}

              {user && (
                <li>
                  <button
                    onClick={handleLogout}
                    style={{
                      ...linkStyle,
                      fontSize: "0.75rem",
                      color: "#ef4444",
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    Keluar
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;
