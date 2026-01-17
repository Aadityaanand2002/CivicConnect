import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import PageWrapper from "../components/PageWrapper";
import { Navigate, Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const STATUS_COLORS = {
  Pending: "#f59e0b",
  "In Progress": "#3b82f6",
  Resolved: "#10b981",
  Rejected: "#ef4444",
};

const styles = {
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  pageTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "800",
    color: "#111827",
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e5e7eb",
    overflow: "hidden", 
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    backgroundColor: "#f9fafb",
    padding: "16px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    borderBottom: "1px solid #e5e7eb",
  },
  td: {
    padding: "16px",
    borderBottom: "1px solid #f3f4f6",
    fontSize: "14px",
    color: "#1f2937",
    verticalAlign: "middle",
  },
  badge: (status) => ({
    backgroundColor: STATUS_COLORS[status] || "#9ca3af",
    color: "white",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    display: "inline-block",
    textAlign: "center",
    minWidth: "80px",
  }),
  select: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    backgroundColor: "#fff",
    fontSize: "13px",
    cursor: "pointer",
    outline: "none",
  },
  thumbnail: {
    width: "48px",
    height: "48px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "2px solid #e5e7eb",
  },
  backBtn: {
    textDecoration: "none",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginBottom: "10px"
  },
  downloadBtn: {
    backgroundColor: "#ef4444", 
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 2px 4px rgba(239, 68, 68, 0.2)",
    transition: "background 0.2s",
  },
  // 🟢 TOOLBAR STYLES
  toolbar: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
    backgroundColor: "#f9fafb",
    padding: "15px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "13px",
    outline: "none",
    minWidth: "160px",
  }
};

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  
  // 🟢 FILTER STATES
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDept, setFilterDept] = useState("All");
  const [filterDate, setFilterDate] = useState(""); // 🟢 Date Filter

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const load = async () => {
    setIsSpinning(true);
    try {
      const res = await axios.get("http://localhost:3001/api/admin/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
    } catch (err) {
      console.error("Error loading complaints");
    } finally {
      setTimeout(() => setIsSpinning(false), 500);
    }
  };

  const updateStatus = async (id, newStatus) => {
    const updatedList = complaints.map(c => 
      c._id === id ? { ...c, status: newStatus } : c
    );
    setComplaints(updatedList);
    await axios.put(
      `http://localhost:3001/api/admin/complaints/${id}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    load();
  };

  // 🟢 SMART FILTER LOGIC (Real-time)
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      // 1. Search (ID, Category, Name)
      const matchesSearch = 
        c.category.toLowerCase().includes(searchText.toLowerCase()) ||
        c.trackingId.toLowerCase().includes(searchText.toLowerCase()) ||
        (c.user?.name || "").toLowerCase().includes(searchText.toLowerCase());

      // 2. Status Filter
      const matchesStatus = filterStatus === "All" || c.status === filterStatus;

      // 3. Dept Filter
      const matchesDept = filterDept === "All" || (c.department || "General") === filterDept;

      // 4. Date Filter (Compare YYYY-MM-DD)
      const complaintDate = new Date(c.createdAt).toISOString().split('T')[0];
      const matchesDate = !filterDate || complaintDate === filterDate;

      return matchesSearch && matchesStatus && matchesDept && matchesDate;
    });
  }, [complaints, searchText, filterStatus, filterDept, filterDate]);

  // 🟢 PDF DOWNLOAD (Uses 'filteredComplaints' so it downloads exactly what you see)
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("CivicConnect - Official Grievance Report", 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Records Found: ${filteredComplaints.length}`, 14, 36);

    const tableColumn = ["Tracking ID", "Category", "Department", "Citizen", "Status", "Date"];
    const tableRows = [];

    filteredComplaints.forEach(c => {
      const complaintData = [
        c.trackingId,
        c.category,
        c.department || "General",
        c.user?.name || "Unknown",
        c.status,
        new Date(c.createdAt).toLocaleDateString(),
      ];
      tableRows.push(complaintData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 42,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235] },
    });
    doc.save("Filtered_Report.pdf");
  };

  useEffect(() => {
    if (token && role === "admin") load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!token || role !== "admin") return <Navigate to="/" replace />;

  return (
    <PageWrapper>
      <Navbar onRefresh={load} isSpinning={isSpinning} />
      
      <Link to="/admin" style={styles.backBtn}>← Back to Dashboard</Link>

      <div style={styles.headerRow}>
        <div>
           <h2 style={styles.pageTitle}>📂 All Complaints Record</h2>
           <span style={{color:"#6b7280", fontWeight:"500", fontSize:"13px"}}>
             Showing {filteredComplaints.length} of {complaints.length} Records
           </span>
        </div>

        <button onClick={downloadPDF} style={styles.downloadBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download Report
        </button>
      </div>

      {/* 🟢 THE FILTER TOOLBAR */}
      <div style={styles.toolbar}>
        <input 
          type="text" 
          placeholder="🔍 Search ID, Name..." 
          style={{ ...styles.input, flex: 2 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        
        <select style={{ ...styles.input, flex: 1 }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select style={{ ...styles.input, flex: 1 }} value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
          <option value="All">All Departments</option>
          <option value="Electricity Dept">Electricity</option>
          <option value="Sanitation Dept">Sanitation</option>
          <option value="Municipal Corporation">Municipal Corp</option>
          <option value="General">General</option>
        </select>

        {/* 🟢 DATE FILTER */}
        <input 
          type="date" 
          style={{ ...styles.input, flex: 1 }}
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />

        {/* 🟢 RESET BUTTON */}
        {(searchText || filterStatus !== "All" || filterDept !== "All" || filterDate) && (
          <button 
            onClick={() => {
              setSearchText("");
              setFilterStatus("All");
              setFilterDept("All");
              setFilterDate("");
            }}
            style={{ ...styles.input, backgroundColor: "#f3f4f6", cursor: "pointer", fontWeight: "bold", border: "1px solid #d1d5db" }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Evidence</th>
              <th style={styles.th}>Info</th>
              <th style={styles.th}>Dept</th>
              <th style={styles.th}>Citizen</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.length === 0 ? (
               <tr><td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "#6b7280", fontStyle: "italic" }}>No matching complaints found.</td></tr>
            ) : (
              filteredComplaints.map((c) => (
                <tr key={c._id} style={{ backgroundColor: "white" }}>
                  <td style={styles.td}>
                    {c.imagePath ? (
                      <a href={c.imagePath} target="_blank" rel="noreferrer">
                        <img src={c.imagePath} alt="Ev" style={styles.thumbnail}/>
                      </a>
                    ) : <span style={{fontSize:'12px', color:'#9ca3af'}}>N/A</span>}
                  </td>
                  <td style={styles.td}>
                    <div style={{ fontWeight: "700", color: "#111827", marginBottom:"4px" }}>{c.category}</div>
                    <div style={{ fontSize: "11px", color: "#6b7280", fontFamily: "monospace" }}>ID: {c.trackingId}</div>
                    <div style={{ fontSize: "11px", color: "#9ca3af", marginTop:"2px" }}>
                      {new Date(c.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={{ backgroundColor: "#f3f4f6", padding: "6px 10px", borderRadius: "6px", fontSize: "12px", color: "#4b5563", fontWeight: "600" }}>
                      {c.department || "General"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={{fontSize:'13px', fontWeight: "500"}}>{c.user?.name}</div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badge(c.status)}>{c.status}</span>
                  </td>
                  <td style={styles.td}>
                    <select style={styles.select} value={c.status} onChange={(e) => updateStatus(c._id, e.target.value)}>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  );
}