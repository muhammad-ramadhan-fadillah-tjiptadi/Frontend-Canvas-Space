import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Pesanan", path: "/admin/pesanan" },
    { name: "Produk", path: "/admin/produk" },
    { name: "Kategori", path: "/admin/kategori" },
  ];

  return (
    <div className="w-full md:w-64 flex-shrink-0 flex flex-col justify-between" style={{
      borderRight: "1px solid #000",
      background: "#000",
      color: "#fff",
      minHeight: "100vh"
    }}>
      <div className="p-8">
        <Link to="/admin/dashboard" className="block mb-12">
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.5rem",
            lineHeight: 1,
            textTransform: "uppercase",
            color: "#fff"
          }}>
            Canvas<br />Space.<br />
            <span style={{ fontSize: "0.5rem", fontFamily: "var(--font-sans)", letterSpacing: "0.2em", display: "block", marginTop: "1rem", color: "rgba(255,255,255,0.7)" }}>
              ADMIN PANEL
            </span>
          </h1>
        </Link>

        <nav className="flex flex-col gap-6">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path) || (item.path === '/admin/dashboard' && location.pathname === '/admin');
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

      <div className="p-8 border-t" style={{ borderColor: "rgba(255,255,255,0.2)" }}>
        <button
          onClick={handleLogout}
          className="text-[10px] uppercase tracking-widest font-bold w-full text-left"
          style={{ color: "#ef4444" }}
        >
          ← KELUAR
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
