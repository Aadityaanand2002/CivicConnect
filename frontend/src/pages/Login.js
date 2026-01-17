import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 🟢 GLOBAL CSS (Animations & Hover Effects)
const globalStyles = `
  @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
  @keyframes floatDelayed { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  
  html { scroll-behavior: smooth; }
  
  .nav-link:hover { color: #2563eb !important; }
  .login-btn:hover { background-color: #1d4ed8 !important; transform: translateY(-2px); box-shadow: 0 6px 15px rgba(37, 99, 235, 0.3); }
  .service-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important; border-color: #bfdbfe !important; }
  .footer-link:hover { color: white !important; padding-left: 5px; }
  .social-icon:hover { color: #60a5fa !important; transform: scale(1.2); }
  
  .input-field { transition: all 0.3s ease; }
`;

const styles = {
  container: { minHeight: "100vh", width: "100%", backgroundColor: "#f8fafc", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif", overflowX: "hidden", position: "relative" },
  
  // Hero
  heroSection: { minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 50%, #ffffff 100%)" },
  waveBg: { position: "absolute", bottom: 0, left: 0, width: "100%", height: "45%", background: "linear-gradient(180deg, rgba(59,130,246,0) 0%, rgba(37,99,235,1) 100%)", zIndex: 0, borderTopLeftRadius: "50% 20%", borderTopRightRadius: "50% 20%", pointerEvents: "none" },
  cloud1: { position: "absolute", top: "15%", left: "10%", fontSize: "40px", opacity: 0.6, animation: "float 4s infinite", zIndex: 0 },
  cloud2: { position: "absolute", top: "25%", right: "40%", fontSize: "30px", opacity: 0.4, animation: "floatDelayed 5s infinite", zIndex: 0 },
  
  // Navbar
  navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 50px", zIndex: 10, backgroundColor: "white", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0 },
  logoRow: { display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" },
  logoIcon: { width: "40px", height: "40px", backgroundColor: "#1e3a8a", color: "white", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "bold" },
  logoText: { fontSize: "20px", fontWeight: "800", color: "#1e3a8a", letterSpacing: "-0.5px" },
  navLinks: { display: "flex", gap: "30px", alignItems: "center", fontSize: "14px", fontWeight: "600", color: "#4b5563" },
  loginBadge: { backgroundColor: "#2563eb", color: "white", padding: "8px 24px", borderRadius: "20px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)" },
  
  tickerBar: { width: "100%", backgroundColor: "#dbeafe", color: "#1e3a8a", padding: "10px 0", textAlign: "center", fontSize: "13px", fontWeight: "600", borderBottom: "1px solid #bfdbfe", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", zIndex: 5, position: "relative" },
  
  contentWrapper: { display: "flex", flex: 1, padding: "0 50px", zIndex: 2, alignItems: "center", justifyContent: "space-between" },
  leftSide: { flex: 1.2, paddingRight: "50px", animation: "fadeIn 1s ease-out" },
  headline: { fontSize: "64px", fontWeight: "900", color: "#111827", lineHeight: "1.1", marginBottom: "20px" },
  blueText: { color: "#2563eb", display: "inline-block", minWidth: "250px" }, 
  subtext: { fontSize: "18px", color: "#6b7280", maxWidth: "500px", lineHeight: "1.6", marginBottom: "40px" },
  statsRow: { display: "flex", gap: "40px", marginTop: "20px" },
  statItem: { borderLeft: "4px solid #2563eb", paddingLeft: "15px" },
  statNumber: { fontSize: "28px", fontWeight: "800", color: "#111827" },
  statLabel: { fontSize: "13px", color: "#6b7280", fontWeight: "600", textTransform: "uppercase" },

  rightSide: { flex: 0.8, display: "flex", justifyContent: "center", animation: "fadeIn 1s ease-out 0.3s backwards" },
  loginCard: { backgroundColor: "white", padding: "40px", borderRadius: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", width: "100%", maxWidth: "380px", position: "relative" },
  avatarIcon: { width: "60px", height: "60px", backgroundColor: "#f3f4f6", borderRadius: "50%", margin: "0 auto 15px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" },
  cardTitle: { textAlign: "center", fontSize: "22px", fontWeight: "800", color: "#1f2937", marginBottom: "10px" },
  cardSubtitle: { textAlign: "center", fontSize: "14px", color: "#6b7280", marginBottom: "25px" },
  input: { width: "100%", padding: "14px 16px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", backgroundColor: "#f9fafb", marginBottom: "15px", outline: "none", boxSizing: "border-box" },
  loginBtn: { width: "100%", padding: "14px", backgroundColor: "#0284c7", color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "bold", cursor: "pointer", marginTop: "10px", boxShadow: "0 4px 12px rgba(2, 132, 199, 0.3)" },
  
  changeEmail: { textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#2563eb", cursor: "pointer", fontWeight: "600" },

  sectionContainer: { padding: "80px 50px", backgroundColor: "white", textAlign: "center" },
  sectionTitle: { fontSize: "32px", fontWeight: "900", color: "#1e3a8a", marginBottom: "15px" },
  sectionDesc: { fontSize: "16px", color: "#6b7280", maxWidth: "600px", margin: "0 auto 50px" },
  
  servicesGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px", maxWidth: "1000px", margin: "0 auto" },
  serviceCard: { padding: "30px", borderRadius: "16px", backgroundColor: "white", border: "1px solid #e2e8f0", cursor: "default", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" },
  iconCircle: { width: "60px", height: "60px", backgroundColor: "#dbeafe", color: "#2563eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" },
  serviceTitle: { fontSize: "18px", fontWeight: "800", color: "#1f2937", marginBottom: "10px" },
  serviceText: { fontSize: "14px", color: "#6b7280", lineHeight: "1.5" },

  aboutRow: { display: "flex", alignItems: "center", gap: "60px", maxWidth: "1000px", margin: "0 auto", textAlign: "left" },
  abstractCityCard: { width: "400px", height: "300px", background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)", borderRadius: "24px", position: "relative", overflow: "hidden", boxShadow: "0 20px 40px rgba(30, 64, 175, 0.25)", display: "flex", alignItems: "center", justifyContent: "center" },
  cityBuilding: { position: "absolute", bottom: "0", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "8px 8px 0 0" },

  footerContainer: { backgroundColor: "#1e293b", padding: "60px 50px", color: "white" },
  footerGrid: { display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: "30px", maxWidth: "1000px", margin: "0 auto" },
  footerTitle: { fontSize: "14px", fontWeight: "bold", marginBottom: "20px", color: "#94a3b8", letterSpacing: "1px" },
  footerLink: { display: "block", marginBottom: "12px", color: "#cbd5e1", cursor: "pointer", fontSize: "14px", textDecoration: "none" },
  socialRow: { display: "flex", gap: "15px", marginTop: "10px" },
  socialIcon: { fontSize: "20px", cursor: "pointer", color: "#cbd5e1" }
};

export default function Login() {
  // 🟢 ZOMATO-STYLE STATE
  const [step, setStep] = useState(1); // 1 = Email, 2 = Password (Login), 3 = Details (Signup)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); 
  
  const [detectedName, setDetectedName] = useState(""); // Stores name if user exists
  const [isLoading, setIsLoading] = useState(false);

  // Animations & Ticker
  const [currentUpdate, setCurrentUpdate] = useState(0);
  const words = ["Smarter", "Cleaner", "Safer", "Better"];
  const [wordIndex, setWordIndex] = useState(0);
  const [countResolved, setCountResolved] = useState(0);
  const [countCitizens, setCountCitizens] = useState(0);

  const navigate = useNavigate();
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);

  const updates = [
    "📢 LIVE: Garbage collected in Sector 62 (5m ago)",
    "🚧 UPDATE: Road repair started in Gandhi Nagar",
    "💡 STATUS: 450 Street Lights fixed today",
    "🌧️ ALERT: Monsoon Safety Guidelines Released"
  ];

  useEffect(() => {
    const interval = setInterval(() => setCurrentUpdate(p => (p + 1) % updates.length), 4000);
    return () => clearInterval(interval);
  }, [updates.length]);

  useEffect(() => {
    const wordInterval = setInterval(() => setWordIndex(p => (p + 1) % words.length), 2500);
    return () => clearInterval(wordInterval);
  }, [words.length]);

  useEffect(() => {
    let start = 0; const end = 98; const duration = 2000;
    const timer = setInterval(() => { start += 2; setCountResolved(start); if (start >= end) clearInterval(timer); }, duration / 50);
    let startCit = 0; const endCit = 500;
    const timerCit = setInterval(() => { startCit += 10; setCountCitizens(startCit); if (startCit >= endCit) clearInterval(timerCit); }, duration / 50);
    return () => { clearInterval(timer); clearInterval(timerCit); };
  }, []);

  const scrollToSection = (ref) => {
    if(ref.current) {
        window.scrollTo({ top: ref.current.offsetTop - 80, behavior: "smooth" });
    }
  };

  // 🟢 STEP 1: CHECK EMAIL (ZOMATO FLOW)
  const handleCheckEmail = async () => {
    if(!email.includes("@")) return alert("Please enter a valid email");
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:3001/api/auth/check-user", { email });
      if (res.data.exists) {
        setDetectedName(res.data.name);
        setStep(2); // Go to Login
      } else {
        setStep(3); // Go to Signup
      }
    } catch (err) {
      alert("Connection Error. Is backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  // 🟢 STEP 2/3: FINAL SUBMIT
  const handleFinalSubmit = async () => {
    setIsLoading(true);
    try {
      // Determine endpoint based on step
      const endpoint = step === 2 ? "/api/auth/login" : "/api/auth/signup";
      const payload = step === 2 ? { email, password } : { name, email, password };
      
      const res = await axios.post(`http://localhost:3001${endpoint}`, payload);
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "admin") navigate("/admin");
      else navigate("/complaints");
    } catch (err) {
      alert(err.response?.data?.message || "Authentication Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <style>{globalStyles}</style>

      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.logoRow} onClick={() => scrollToSection(homeRef)}>
          <img src="https://cdn-icons-png.flaticon.com/512/921/921347.png" alt="Emblem" style={{width:"40px"}}/>
          <div>
            <div style={styles.logoText}>CIVIC CONNECT</div>
            <div style={{fontSize:"10px", color:"#6b7280", letterSpacing:"1px"}}>GOVERNMENT OF INDIA</div>
          </div>
        </div>
        <div style={styles.navLinks}>
          <span className="nav-link" onClick={() => scrollToSection(homeRef)}>Home</span>
          <span className="nav-link" onClick={() => scrollToSection(aboutRef)}>About</span>
          <span className="nav-link" onClick={() => scrollToSection(servicesRef)}>Services</span>
          <span style={styles.loginBadge} onClick={() => { scrollToSection(homeRef); setEmail(""); setStep(1); }}>
             Login / Signup
          </span>
        </div>
      </div>

      <div style={styles.tickerBar}>
        <span style={{width:"8px", height:"8px", backgroundColor:"#10b981", borderRadius:"50%"}}></span>
        {updates[currentUpdate]}
      </div>

      {/* Hero Section */}
      <div style={styles.heroSection} ref={homeRef}>
        <div style={styles.cloud1}>☁️</div>
        <div style={styles.cloud2}>🚁</div>
        
        <div style={styles.contentWrapper}>
            <div style={styles.leftSide}>
            <h1 style={styles.headline}>
                Building a <br/>
                <span style={styles.blueText} className="dynamic-word">
                {words[wordIndex]} City
                </span>, <br/>
                Together.
            </h1>
            <p style={styles.subtext}>
                A unified platform to register, track, and resolve citizen grievances. 
                Join <strong>{countCitizens},000</strong> citizens driving change.
            </p>
            
            <div style={styles.statsRow}>
                <div style={styles.statItem}>
                <div style={styles.statNumber}>{countResolved}%</div>
                <div style={styles.statLabel}>Issues Resolved</div>
                </div>
                <div style={styles.statItem}>
                <div style={styles.statNumber}>24hr</div>
                <div style={styles.statLabel}>Avg Response</div>
                </div>
            </div>
            </div>

            <div style={styles.rightSide}>
            {/* 🟢 DYNAMIC ZOMATO-STYLE CARD */}
            <div style={styles.loginCard}>
                <div style={styles.avatarIcon}>👤</div>
                
                {/* STEP 1: EMAIL ENTRY */}
                {step === 1 && (
                  <>
                    <h3 style={styles.cardTitle}>Get Started</h3>
                    <p style={styles.cardSubtitle}>Enter your email to login or sign up</p>
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      style={styles.input} 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && handleCheckEmail()}
                    />
                    <button style={styles.loginBtn} onClick={handleCheckEmail} disabled={isLoading}>
                      {isLoading ? "Checking..." : "Continue"}
                    </button>
                  </>
                )}

                {/* STEP 2: LOGIN (User Exists) */}
                {step === 2 && (
                  <>
                    <h3 style={styles.cardTitle}>Welcome Back</h3>
                    <p style={styles.cardSubtitle}>Hi <strong>{detectedName}</strong>, enter password to login</p>
                    <input 
                      type="password" 
                      placeholder="Enter Password" 
                      style={styles.input} 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                    />
                    <button style={styles.loginBtn} onClick={handleFinalSubmit} disabled={isLoading}>
                      {isLoading ? "Verifying..." : "Login"}
                    </button>
                    <div style={styles.changeEmail} onClick={() => {setStep(1); setPassword("");}}>← Change Email</div>
                  </>
                )}

                {/* STEP 3: SIGNUP (New User) */}
                {step === 3 && (
                  <>
                    <h3 style={styles.cardTitle}>Create Account</h3>
                    <p style={styles.cardSubtitle}>Looks like you're new here!</p>
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      style={styles.input} 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                    />
                    <input 
                      type="password" 
                      placeholder="Create Password" 
                      style={styles.input} 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                    />
                    <button style={styles.loginBtn} onClick={handleFinalSubmit} disabled={isLoading}>
                      {isLoading ? "Creating..." : "Sign Up"}
                    </button>
                    <div style={styles.changeEmail} onClick={() => {setStep(1); setPassword(""); setName("");}}>← Change Email</div>
                  </>
                )}

            </div>
            </div>
        </div>
        <div style={styles.waveBg}></div>
      </div>

      {/* About Section */}
      <div ref={aboutRef} style={styles.sectionContainer}>
        <h2 style={styles.sectionTitle}>About The Initiative</h2>
        <p style={styles.sectionDesc}>Bridging the gap between citizens and administration with technology.</p>
        
        <div style={styles.aboutRow}>
            <div style={styles.abstractCityCard}>
                <div style={{...styles.cityBuilding, width:"60px", height:"120px", left:"50px"}}></div>
                <div style={{...styles.cityBuilding, width:"80px", height:"180px", left:"120px", backgroundColor:"rgba(255,255,255,0.2)"}}></div>
                <div style={{...styles.cityBuilding, width:"50px", height:"90px", left:"210px"}}></div>
                <div style={{...styles.cityBuilding, width:"70px", height:"140px", left:"270px", backgroundColor:"rgba(255,255,255,0.15)"}}></div>
                <div style={{position:"absolute", top:"40px", right:"40px", width:"40px", height:"40px", borderRadius:"50%", backgroundColor:"rgba(255,255,255,0.8)", boxShadow:"0 0 20px rgba(255,255,255,0.5)"}}></div>
            </div>

            <div style={{textAlign:"left"}}>
                <h3 style={{...styles.serviceTitle, fontSize:"28px", color:"#1e3a8a"}}>Empowering Governance</h3>
                <p style={{...styles.serviceText, fontSize:"16px", marginBottom:"25px", lineHeight:"1.8"}}>
                    Civic Connect digitizes public grievance redressal using Computer Vision. 
                    We prioritize complaints based on urgency, ensuring that critical hazards are handled immediately.
                </p>
                <button style={{...styles.loginBtn, width:"auto", padding:"12px 30px", backgroundColor:"#1e40af"}}>Read Mission Statement</button>
            </div>
        </div>
      </div>

      {/* Services Section */}
      <div ref={servicesRef} style={{...styles.sectionContainer, backgroundColor:"#f8fafc"}}>
        <h2 style={styles.sectionTitle}>Our Services</h2>
        <p style={styles.sectionDesc}>Advanced tools to keep your neighborhood safe and clean.</p>
        
        <div style={styles.servicesGrid}>
            <div style={styles.serviceCard} className="service-card">
                <div style={styles.iconCircle}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                </div>
                <h4 style={styles.serviceTitle}>AI Reporting</h4>
                <p style={styles.serviceText}>Smart image recognition identifies issues instantly—no typing needed.</p>
            </div>

            <div style={styles.serviceCard} className="service-card">
                <div style={styles.iconCircle}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <h4 style={styles.serviceTitle}>Geo-Tagging</h4>
                <p style={styles.serviceText}>Precise GPS location ensures authorities reach the exact spot.</p>
            </div>

            <div style={styles.serviceCard} className="service-card">
                <div style={styles.iconCircle}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                </div>
                <h4 style={styles.serviceTitle}>Priority Sorting</h4>
                <p style={styles.serviceText}>Critical hazards like fires or open wires get immediate attention.</p>
            </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footerContainer}>
        <div style={styles.footerGrid}>
            <div>
                <div style={{display:"flex", alignItems:"center", gap:"10px", marginBottom:"15px"}}>
                    <div style={{...styles.logoIcon, width:"30px", height:"30px", fontSize:"16px"}}>CC</div>
                    <span style={{fontWeight:"bold", fontSize:"18px"}}>CIVIC CONNECT</span>
                </div>
                <p style={{opacity:0.7, lineHeight:"1.6"}}>
                    A Government of India initiative to build smarter, safer, and cleaner cities for everyone.
                </p>
            </div>
            <div>
                <div style={styles.footerTitle}>QUICK LINKS</div>
                <span className="footer-link" onClick={() => scrollToSection(homeRef)}>Home</span>
                <span className="footer-link" onClick={() => scrollToSection(aboutRef)}>About Us</span>
                <span className="footer-link" onClick={() => scrollToSection(servicesRef)}>Services</span>
            </div>
            <div>
                <div style={styles.footerTitle}>CONTACT</div>
                <span className="footer-link">📧 helpdesk@civicconnect.gov.in</span>
                <span className="footer-link">📞 1800-111-2222 (Toll Free)</span>
                <span className="footer-link">📍 Ministry of Urban Affairs, New Delhi</span>
            </div>
            
            <div>
               <div style={styles.footerTitle}>FOLLOW US</div>
               <div style={styles.socialRow}>
                  <span className="social-icon" style={{fontSize: "20px", cursor: "pointer", color: "#cbd5e1"}}>
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </span>
                  <span className="social-icon" style={{fontSize: "20px", cursor: "pointer", color: "#cbd5e1"}}>
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                  </span>
                  <span className="social-icon" style={{fontSize: "20px", cursor: "pointer", color: "#cbd5e1"}}>
                     <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </span>
               </div>
            </div>

        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,0.1)", marginTop:"40px", paddingTop:"20px", textAlign:"center", opacity:0.5, fontSize:"13px"}}>
            © 2024 Civic Connect. All rights reserved. | Privacy Policy | Terms of Service
        </div>
      </div>

    </div>
  );
}