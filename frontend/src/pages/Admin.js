import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const [complaints, setComplaints] = useState([]);
  const token = localStorage.getItem("token");

  const load = async () => {
    const res = await axios.get("http://localhost:3001/api/admin/complaints", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setComplaints(res.data);
  };

  const updateStatus = async (id, status) => {
    await axios.put(
      `http://localhost:3001/api/admin/complaints/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      {complaints.map((c) => (
        <div key={c._id} className="card">
          <p>
            <b>User:</b> {c.user?.name} ({c.user?.email})
          </p>
          <p><b>Category:</b> {c.category}</p>
          <p><b>Description:</b> {c.description}</p>
          <p className="status"><b>Status:</b> {c.status}</p>

          <button onClick={() => updateStatus(c._id, "Resolved")}>
            Mark Resolved
          </button>
        </div>
      ))}
    </div>
  );
}
