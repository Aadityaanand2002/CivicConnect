import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Complaints from "./pages/Complaints";
import Admin from "./pages/Admin";
import TrackComplaint from "./pages/TrackComplaint";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminComplaints from "./pages/AdminComplaints";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/track" element={<TrackComplaint />} />

        {/* Protected User Route */}
        <Route
          path="/complaints"
          element={
            <ProtectedRoute>
              <Complaints />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/complaints" element={<AdminComplaints />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;