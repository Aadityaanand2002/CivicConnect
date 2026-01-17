import { useState } from "react";
import axios from "axios";
import PageWrapper from "../components/PageWrapper";

export default function TrackComplaint() {
  const [trackingId, setTrackingId] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const search = async () => {
    try {
      setError("");
      const res = await axios.get(
        `http://localhost:3001/api/complaints/track/${trackingId}`
      );
      setData(res.data);
    } catch {
      setData(null);
      setError("Invalid Tracking ID");
    }
  };

  return (
    <PageWrapper>
      <h2>Track Your Complaint</h2>

      <input
        placeholder="Enter Tracking ID"
        value={trackingId}
        onChange={(e) => setTrackingId(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button onClick={search}>Track</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <div style={{ marginTop: "20px", border: "1px solid #ddd", padding: "12px" }}>
          <p><b>Tracking ID:</b> {data.trackingId}</p>
          <p><b>Category:</b> {data.category}</p>
          <p><b>Status:</b> {data.status}</p>
          <p><b>Registered On:</b> {new Date(data.createdAt).toDateString()}</p>
        </div>
      )}
    </PageWrapper>
  );
}
