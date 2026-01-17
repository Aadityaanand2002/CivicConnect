import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sentiment from "sentiment";
// 🟢 REQUIREMENT: npm install @tensorflow-models/coco-ssd @tensorflow/tfjs
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs"; 

const sentiment = new Sentiment();

const styles = {
  pageBackground: {
    minHeight: "100vh", backgroundColor: "#f8fafc",
    backgroundImage: "linear-gradient(120deg, #eff6ff 0%, #f1f5f9 100%)",
    paddingBottom: "80px", fontFamily: "'Inter', sans-serif"
  },
  navContainer: { maxWidth: "1200px", margin: "0 auto 30px auto", padding: "20px" },
  mainContainer: {
    maxWidth: "1200px", margin: "0 auto", padding: "0 20px",
    display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "30px", alignItems: "start"
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(20px)",
    borderRadius: "24px", padding: "40px", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.08)",
    border: "1px solid rgba(255, 255, 255, 0.6)", position: "relative"
  },
  label: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", fontWeight: "700", fontSize: "12px", color: "#475569", textTransform: "uppercase" },
  input: { width: "100%", padding: "16px", borderRadius: "12px", border: "2px solid #e2e8f0", backgroundColor: "#f8fafc", fontSize: "15px", outline: "none" },
  errorBanner: {
    backgroundColor: "#fef2f2", borderLeft: "4px solid #ef4444", borderRadius: "12px", padding: "16px", marginTop: "15px",
    color: "#b91c1c", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px",
    animation: "fadeIn 0.3s ease-in-out"
  },
  primaryBtn: {
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", color: "white", padding: "20px", border: "none", borderRadius: "14px",
    cursor: "pointer", fontWeight: "700", fontSize: "16px", width: "100%", boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)"
  },
  secondaryBtn: { backgroundColor: "white", color: "#334155", padding: "14px 24px", borderRadius: "12px", border: "1px solid #e2e8f0", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" },
  previewImg: { width: "100%", height: "240px", objectFit: "cover", borderRadius: "16px", marginTop: "20px", border: "2px solid #e2e8f0" },
  statCard: { backgroundColor: "white", borderRadius: "16px", padding: "20px", border: "1px solid #e2e8f0" }
};

export default function Complaints() {
  const [category, setCategory] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ pending: 0, resolved: 0 });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => { loadComplaints(); loadModel(); }, []);

  const loadModel = async () => { 
    try { modelRef.current = await cocoSsd.load(); } catch (err) { console.error("AI Error", err); } 
  };

  const loadComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/complaints", { headers: { Authorization: `Bearer ${token}` } });
      setComplaints(res.data);
      setStats({
        pending: res.data.filter(c => c.status === "Pending").length,
        resolved: res.data.filter(c => c.status === "Resolved").length
      });
    } catch (err) {}
  };

  // 🔴 HARD RESET AI GUARD
  const handleImageUpload = async (file) => {
    setImageError(null); 
    if (!file) return;

    // Temporarily show preview while scanning
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    setIsScanning(true);
    
    if (modelRef.current) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        
        img.onload = async () => {
            const predictions = await modelRef.current.detect(img);
            const isPerson = predictions.some(p => p.class === "person");

            if (isPerson) {
                // 1. Set Error
                setImageError("🚫 Invalid Image: People detected. Please enter a valid infrastructure image.");
                // 2. Clear States
                setImage(null);
                setImagePreview(null);
                // 3. Reset the File Input value manually
                if (fileInputRef.current) fileInputRef.current.value = "";
                
                // 4. Make message disappear after 4 seconds
                setTimeout(() => { setImageError(null); }, 4000);
            } else {
                setImage(file); // Accept the file
            }
            setIsScanning(false);
        };
    }
  };

  const detectLocation = () => {
    if(!navigator.geolocation) return alert("Not supported");
    navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
            const data = await res.json();
            setLocationAddress(data.display_name);
        } catch { setLocationAddress(`${pos.coords.latitude}, ${pos.coords.longitude}`); }
    });
  };

  const submitData = async () => {
    if (!category || !description || !locationAddress) return alert("Fill all fields");
    setLoading(true);
    const formData = new FormData();
    formData.append("category", category); formData.append("location", locationAddress);
    formData.append("description", description); formData.append("priority", priority);
    if (image) formData.append("image", image);

    try {
      await axios.post("http://localhost:3001/api/complaints", formData, { headers: { Authorization: `Bearer ${token}` } });
      setCategory(""); setLocationAddress(""); setDescription(""); setPriority("Low"); setImage(null); setImagePreview(null);
      loadComplaints();
    } catch { alert("Error"); } finally { setLoading(false); }
  };

  return (
    <div style={styles.pageBackground}>
      <div style={styles.navContainer}><Navbar onRefresh={loadComplaints} isSpinning={loading} /></div>
      <div style={styles.mainContainer}>
        <div style={styles.card}>
            <div style={{marginBottom:"30px", borderBottom:"2px solid #f1f5f9", paddingBottom:"20px"}}>
                <h2 style={{fontSize:"22px", fontWeight:"800", color:"#1e3a8a", margin:0}}>📝 Register Grievance</h2>
            </div>

            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px", marginBottom:"25px"}}>
                <div><label style={styles.label}>Category</label>
                    <select style={styles.input} value={category} onChange={e=>setCategory(e.target.value)}>
                        <option value="">-- Select --</option>
                        <option value="Street Light">💡 Street Light</option>
                        <option value="Garbage">🗑️ Garbage</option>
                        <option value="Road Damage">🛣️ Road Damage</option>
                        <option value="Water Logging">💧 Water Logging</option>
                    </select>
                </div>
                <div><label style={styles.label}>Priority</label>
                    <select style={styles.input} value={priority} onChange={e=>setPriority(e.target.value)}>
                        <option value="Low">🟢 Low</option>
                        <option value="Medium">🟡 Medium</option>
                        <option value="High">🔴 High</option>
                    </select>
                </div>
            </div>

            <div style={{marginBottom:"25px"}}><label style={styles.label}>Location</label>
                <div style={{display:"flex", gap:"10px"}}>
                    <input style={styles.input} placeholder="e.g. Near Market..." value={locationAddress} onChange={e=>setLocationAddress(e.target.value)} />
                    <button style={styles.secondaryBtn} onClick={detectLocation}>📍 Detect</button>
                </div>
            </div>

            <div style={{marginBottom:"25px"}}><label style={styles.label}>Evidence</label>
                <input type="file" ref={fileInputRef} style={styles.input} onChange={e=>handleImageUpload(e.target.files[0])} accept="image/*" />
                {isScanning && <div style={{color:"#2563eb", marginTop:"10px", fontWeight:"bold"}}>🔄 AI Scanning Image...</div>}
                {imageError && <div style={styles.errorBanner}><span>⚠️</span> {imageError}</div>}
                {imagePreview && !imageError && <img src={imagePreview} alt="Preview" style={styles.previewImg} />}
            </div>

            <div style={{marginBottom:"30px"}}><label style={styles.label}>Description</label>
                <textarea style={{...styles.input, fontFamily:"inherit"}} rows="3" placeholder="Describe the issue..." value={description} onChange={e=>setDescription(e.target.value)} />
            </div>

            <button style={styles.primaryBtn} onClick={submitData} disabled={loading || isScanning || imageError}>
                {loading ? "Submitting..." : "✅ Submit Grievance"}
            </button>
        </div>

        <div style={{display:"flex", flexDirection:"column", gap:"20px"}}>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"15px"}}>
                <div style={{...styles.statCard, borderLeft:"4px solid #ea580c"}}><div style={{fontSize:"32px", fontWeight:"800", color:"#ea580c"}}>{stats.pending}</div><div style={{fontSize:"12px", fontWeight:"700", color:"#64748b"}}>PENDING</div></div>
                <div style={{...styles.statCard, borderLeft:"4px solid #16a34a"}}><div style={{fontSize:"32px", fontWeight:"800", color:"#16a34a"}}>{stats.resolved}</div><div style={{fontSize:"12px", fontWeight:"700", color:"#64748b"}}>RESOLVED</div></div>
            </div>
            <div style={styles.card}>
                <h3 style={{fontSize:"16px", fontWeight:"800", color:"#1e3a8a", marginBottom:"20px"}}>📂 My Case History</h3>
                {complaints.map(c => (
                    <div key={c._id} style={{padding:"15px", borderRadius:"12px", border:"1px solid #e2e8f0", marginBottom:"10px", backgroundColor:"white"}}>
                        <div style={{display:"flex", justifyContent:"space-between"}}>
                            <div style={{fontWeight:"700", fontSize:"14px"}}>{c.category}</div>
                            <div style={{fontSize:"10px", fontWeight:"800", padding:"2px 8px", borderRadius:"10px", background:"#ffedd5", color:"#c2410c"}}>{c.status}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}