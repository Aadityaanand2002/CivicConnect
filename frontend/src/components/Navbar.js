import { useNavigate } from "react-router-dom";

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    backgroundColor: "white",
    padding: "15px 20px",
    borderRadius: "12px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoIcon: {
    backgroundColor: "#2563eb",
    color: "white",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "20px",
  },
  logoText: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "800",
    color: "#111827",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    margin: 0,
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: "500",
  },
  actions: {
    display: "flex",
    gap: "12px", // Space between Refresh and Logout
    alignItems: "center",
  },
  logoutBtn: {
    backgroundColor: "#fee2e2",
    color: "#ef4444",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "background 0.2s",
  },
  // 🟢 NEW REFRESH BUTTON STYLE
  refreshBtn: {
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.2s",
  }
};

// 🟢 Accept 'onRefresh' prop
export default function Navbar({ onRefresh, isSpinning }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>CC</div>
        <div style={styles.logoText}>
          <h1 style={styles.title}>CivicConnect</h1>
          <p style={styles.subtitle}>Government Grievance Portal</p>
        </div>
      </div>

      <div style={styles.actions}>
        {/* 🟢 ONLY SHOW IF PAGE PROVIDES REFRESH FUNCTION */}
        {onRefresh && (
          <button 
            onClick={onRefresh} 
            style={styles.refreshBtn}
            onMouseOver={(e) => e.target.style.backgroundColor = "#e5e7eb"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#f3f4f6"}
          >
            <svg 
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transition: "transform 0.5s ease", transform: isSpinning ? "rotate(360deg)" : "rotate(0deg)" }}
            >
              <path d="M23 4v6h-6"></path>
              <path d="M1 20v-6h6"></path>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            Refresh
          </button>
        )}

        <button 
          onClick={handleLogout} 
          style={styles.logoutBtn}
          onMouseOver={(e) => e.target.style.backgroundColor = "#fecaca"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#fee2e2"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}