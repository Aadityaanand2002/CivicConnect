import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; 
import { 
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, ResponsiveContainer, AreaChart, Area 
} from "recharts";

// --- BRAND CONFIGURATION ---
const BRAND = {
  primary: "#0ea5e9", // Vivid Sky Blue
  secondary: "#6366f1", // Indigo
  accent: "#f97316", // Orange
  success: "#10b981",
  danger: "#ef4444",
  textDark: "#0f172a",
  textLight: "#64748b",
};

const STATUS_COLORS = {
  Pending: "#f59e0b",
  "In Progress": "#0ea5e9",
  Resolved: "#10b981",
  Rejected: "#ef4444"
};

const PRIORITY_COLORS = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#94a3b8"
};

const styles = {
  // 1. ULTRA-PREMIUM BACKGROUND
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    // Complex Aurora Gradient
    backgroundImage: `
      radial-gradient(at 0% 0%, hsla(253,16%,7%,0) 0, transparent 50%), 
      radial-gradient(at 50% 0%, hsla(225,39%,30%,0) 0, transparent 50%), 
      radial-gradient(at 100% 0%, hsla(339,49%,30%,0) 0, transparent 50%),
      linear-gradient(120deg, #e0f2fe 0%, #f0f9ff 50%, #eff6ff 100%)
    `,
    padding: "40px",
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
    overflowX: "hidden"
  },

  // 2. AMBIENT GLOW ORBS
  orb1: {
    position: "absolute", top: "-10%", left: "-5%", width: "600px", height: "600px",
    background: "radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, rgba(255,255,255,0) 70%)",
    filter: "blur(60px)", zIndex: 0, animation: "float 10s ease-in-out infinite"
  },
  orb2: {
    position: "absolute", top: "20%", right: "-10%", width: "500px", height: "500px",
    background: "radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(255,255,255,0) 70%)",
    filter: "blur(60px)", zIndex: 0
  },

  // 3. GLOSSY GLASS CARD (The "Apple" Look)
  glassCard: {
    // Gradient overlay to simulate light reflection
    background: "linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    // Crisp white border
    border: "1px solid rgba(255, 255, 255, 0.8)",
    // Soft, multi-layered shadow for depth
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.05), 0 2px 8px rgba(31, 38, 135, 0.05)",
    borderRadius: "24px",
    padding: "26px",
    position: "relative",
    zIndex: 1,
    transition: "transform 0.3s ease, box-shadow 0.3s ease"
  },

  // Header
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px",
    position: "relative", zIndex: 2
  },
  title: { 
    fontSize: "36px", fontWeight: "800", color: BRAND.textDark, letterSpacing: "-1px", margin: 0,
    background: "linear-gradient(to right, #0f172a, #334155)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
  },
  subtitle: { color: BRAND.textLight, fontSize: "15px", marginTop: "6px", fontWeight: "500" },
  
  // Modern Refresh Button
  refreshBtn: {
    background: "rgba(255,255,255,0.8)", border: "1px solid white", padding: "12px 24px",
    borderRadius: "16px", fontWeight: "600", color: BRAND.textLight, cursor: "pointer",
    display: "flex", alignItems: "center", gap: "10px", transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(0,0,0,0.03)", backdropFilter: "blur(4px)"
  },

  // Grids
  statsGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px", marginBottom: "32px", position: "relative", zIndex: 1
  },
  chartsGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
    gap: "24px", marginBottom: "32px", position: "relative", zIndex: 1
  },

  // Stat Typography
  statLabel: { fontSize: "12px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "8px" },
  statNumber: { 
    fontSize: "44px", fontWeight: "800", margin: "0", lineHeight: "1.1",
    // Gradient Text for Stats
    background: "linear-gradient(135deg, #0f172a 0%, #475569 100%)", 
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
  },
  statTrend: { 
    fontSize: "13px", marginTop: "12px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "4px 10px", borderRadius: "20px", background: "rgba(255,255,255,0.5)"
  },
  
  // Charts
  chartTitle: {
    fontSize: "18px", fontWeight: "700", color: BRAND.textDark, marginBottom: "28px",
    display: "flex", alignItems: "center", justifyContent: "space-between"
  },
  badge: { 
    padding: "6px 14px", borderRadius: "30px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", 
    boxShadow: "0 2px 6px rgba(0,0,0,0.06)", letterSpacing: "0.5px"
  },

  // Table styling
  tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  tableTitle: { fontSize: "22px", fontWeight: "700", color: BRAND.textDark, margin: 0 },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" },
  th: { textAlign: "left", padding: "0 24px", fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.8px" },
  tr: { 
    background: "white", transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(0,0,0,0.01)" 
  }, 
  td: { padding: "20px 24px", fontSize: "14px", color: "#334155", fontWeight: "600" },
  tdFirst: { borderTopLeftRadius: "16px", borderBottomLeftRadius: "16px" },
  tdLast: { borderTopRightRadius: "16px", borderBottomRightRadius: "16px" },
  
  // Buttons
  actionBtn: {
    padding: "8px", borderRadius: "10px", border: "none", cursor: "pointer",
    fontSize: "15px", marginRight: "10px", transition: "0.2s", display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: "36px", height: "36px"
  },
  viewBtn: { background: "#e0f2fe", color: "#0284c7" },
  manageBtn: { background: "#f1f5f9", color: "#64748b" },
  
  statusBadge: {
    padding: "8px 16px", borderRadius: "30px", fontSize: "11px", fontWeight: "700", 
    display: "inline-block", color: "white", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", letterSpacing: "0.5px"
  }
};

export default function Admin() {
  const [hoveredStat, setHoveredStat] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate(); 
  
  // --- REAL DATA SOURCE ---
  const recentComplaints = [
    { id: "CC-9821", type: "Garbage", dept: "Municipal Corp", status: "Resolved", priority: "High", date: "2 mins ago" },
    { id: "CC-4491", type: "Street Light", dept: "Electricity Dept", status: "Pending", priority: "Medium", date: "15 mins ago" },
    { id: "CC-3284", type: "Sewage", dept: "Sanitation Dept", status: "In Progress", priority: "High", date: "1 hour ago" },
    { id: "CC-1129", type: "Potholes", dept: "PWD", status: "Pending", priority: "Low", date: "3 hours ago" },
    { id: "CC-5521", type: "Water Leak", dept: "Water Dept", status: "Resolved", priority: "Medium", date: "5 hours ago" },
  ];

  // --- DYNAMIC CALCULATIONS ---
  const stats = useMemo(() => {
    return {
      total: recentComplaints.length,
      pending: recentComplaints.filter(c => c.status === "Pending").length,
      inProgress: recentComplaints.filter(c => c.status === "In Progress").length,
      resolved: recentComplaints.filter(c => c.status === "Resolved").length
    };
  }, [recentComplaints]);

  const pieData = useMemo(() => [
    { name: "Pending", value: stats.pending },
    { name: "In Progress", value: stats.inProgress },
    { name: "Resolved", value: stats.resolved },
    { name: "Rejected", value: 0 } 
  ].filter(d => d.value > 0), [stats]);

  const deptData = useMemo(() => {
    const counts = {};
    recentComplaints.forEach(c => {
      counts[c.dept] = (counts[c.dept] || 0) + 1;
    });
    return Object.keys(counts).map(dept => ({ name: dept, count: counts[dept] }));
  }, [recentComplaints]);

  const priorityData = useMemo(() => {
    const counts = { High: 0, Medium: 0, Low: 0 };
    recentComplaints.forEach(c => {
      if (counts[c.priority] !== undefined) counts[c.priority]++;
    });
    return Object.keys(counts)
      .map(p => ({ name: p, value: counts[p] }))
      .filter(d => d.value > 0);
  }, [recentComplaints]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => { setIsRefreshing(false); }, 1000);
  };

  const handleViewAll = () => { navigate("/admin/complaints"); };

  const trendData = [
    { day: "Mon", count: 2 }, { day: "Tue", count: 4 }, { day: "Wed", count: 1 },
    { day: "Thu", count: 5 }, { day: "Fri", count: 3 }, { day: "Sat", count: 4 }, { day: "Sun", count: 1 }
  ];

  return (
    <div style={styles.container}>
      
      {/* Ambient Orbs */}
      <div style={styles.orb1}></div>
      <div style={styles.orb2}></div>

      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Command Center</h1>
          <p style={styles.subtitle}>Welcome back, Administrator</p>
        </div>
        <button 
          style={{
            ...styles.refreshBtn, 
            opacity: isRefreshing ? 0.7 : 1,
            cursor: isRefreshing ? 'wait' : 'pointer'
          }} 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <span style={{ 
            display: 'inline-block', transition: 'transform 0.5s',
            transform: isRefreshing ? 'rotate(360deg)' : 'rotate(0deg)', fontSize: "18px"
          }}>↻</span> 
          {isRefreshing ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* STATS CARDS */}
      <div style={styles.statsGrid}>
        {[
          { label: "Total Complaints", value: stats.total, color: BRAND.primary, trend: "+12%", up: true },
          { label: "Pending", value: stats.pending, color: STATUS_COLORS.Pending, trend: "-5%", up: true },
          { label: "In Progress", value: stats.inProgress, color: STATUS_COLORS["In Progress"], trend: "+8%", up: true },
          { label: "Resolved", value: stats.resolved, color: STATUS_COLORS.Resolved, trend: "+15%", up: true }
        ].map((stat, i) => (
          <div 
            key={i}
            style={{
              ...styles.glassCard,
              transform: hoveredStat === i ? "translateY(-8px)" : "translateY(0)",
              boxShadow: hoveredStat === i ? "0 20px 40px rgba(0,0,0,0.08)" : styles.glassCard.boxShadow,
              borderTop: `4px solid ${stat.color}` 
            }}
            onMouseEnter={() => setHoveredStat(i)}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <div style={styles.statLabel}>{stat.label}</div>
            <div style={{...styles.statNumber, 
              background: `linear-gradient(135deg, ${stat.color} 0%, #1e293b 100%)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>{stat.value}</div>
            
            <div style={styles.statTrend}>
              <span style={{color: stat.up ? BRAND.success : BRAND.danger, fontWeight: 800}}>{stat.up ? "↗" : "↘"} {stat.trend}</span>
              <span style={{color: "#94a3b8", fontWeight: "500"}}> vs last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS ROW 1 */}
      <div style={styles.chartsGrid}>
        <div style={styles.glassCard}>
          <div style={styles.chartTitle}>
            Status Distribution
            <span style={{...styles.badge, background: "#e0f2fe", color: BRAND.primary}}>Live Update</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{background: 'rgba(255,255,255,0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)'}} 
                itemStyle={{color: '#334155', fontWeight: 600}}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.glassCard}>
          <div style={styles.chartTitle}>Department Breakdown</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={deptData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={110} tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)'}} />
              <Bar dataKey="count" fill={BRAND.primary} radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHARTS ROW 2 */}
      <div style={styles.chartsGrid}>
        <div style={styles.glassCard}>
          <div style={styles.chartTitle}>
            Activity Trend
            <span style={{...styles.badge, background: "#dcfce7", color: BRAND.success}}>+18% Growth</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={BRAND.primary} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={BRAND.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)'}} />
              <Area type="monotone" dataKey="count" stroke={BRAND.primary} strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.glassCard}>
          <div style={styles.chartTitle}>Priority Heatmap</div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={priorityData} cx="50%" cy="50%" outerRadius={80} dataKey="value" stroke="none"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)'}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- RECENT COMPLAINTS TABLE --- */}
      <div style={styles.glassCard}>
        <div style={styles.tableHeader}>
          <h3 style={styles.tableTitle}>Recent Complaints</h3>
          <button style={styles.refreshBtn} onClick={handleViewAll}>
            View All Reports →
          </button>
        </div>
        
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Department</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {recentComplaints.map((item, index) => (
              <tr 
                key={index} 
                style={styles.tr} 
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.01)";
                  e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(0,0,0,0.05)";
                  e.currentTarget.style.zIndex = 10;
                  e.currentTarget.style.position = "relative";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.01)";
                  e.currentTarget.style.zIndex = 0;
                }}
              >
                <td style={{...styles.td, ...styles.tdFirst}}>
                  <span style={{fontWeight: 800, color: BRAND.primary}}>#{item.id}</span>
                </td>
                <td style={styles.td}><strong>{item.type}</strong></td>
                <td style={styles.td}>{item.dept}</td>
                <td style={styles.td}>
                  <span style={{...styles.statusBadge, background: STATUS_COLORS[item.status]}}>
                    {item.status}
                  </span>
                </td>
                <td style={{...styles.td, color: "#64748b"}}>{item.date}</td>
                <td style={{...styles.td, ...styles.tdLast}}>
                  <button 
                    style={{...styles.actionBtn, ...styles.viewBtn}} 
                    title="View Details"
                    onClick={() => navigate(`/admin/complaints`)} 
                  >
                    👁️
                  </button>
                  <button 
                    style={{...styles.actionBtn, ...styles.manageBtn}} 
                    title="Manage Status"
                    onClick={() => navigate(`/admin/complaints`)}
                  >
                    ✏️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}