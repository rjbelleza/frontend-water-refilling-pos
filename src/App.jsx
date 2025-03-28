import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSales from "./pages/AdminSales";
import NewSalesPage from "./pages/NewSalesPage";

// Protected Route Wrapper
const ProtectedRoute = ({ element, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // Wait for auth check

  if (!user) return <Navigate to="/" replace />; // Redirect if not logged in

  if (role && user.role !== role) return <Navigate to="/" replace />; // Restrict by role

  return element;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} role="admin" />} />
          <Route path="/admin-sales" element={<ProtectedRoute element={<AdminSales />} role="admin" />} />
          <Route path="/new-sales" element={<ProtectedRoute element={<NewSalesPage />} role="admin" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
