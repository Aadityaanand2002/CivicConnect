import { useState } from "react";
import axios from "axios";

export default function Complaints() {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const submit = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:3001/api/complaints",
        { category, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Complaint submitted successfully");
      setCategory("");
      setDescription("");
    } catch (err) {
      alert("Error submitting complaint");
    }
  };

  return (
    <div className="container">
      <h2>Create Complaint</h2>

      <input
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={submit}>Submit</button>
    </div>
  );
}
