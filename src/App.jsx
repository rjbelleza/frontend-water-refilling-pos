import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import SalesPage from "./pages/SalesPage";
import NewSalesPage from "./pages/NewSalesPage";
import InventoryPage from "./pages/InventoryPage";
import LoadingScreen from "./pages/LoadingScreen";
import ExpensesPage from "./pages/ExpensesPage";
import ReportsPage from "./pages/ReportsPage";

// Protected Route Wrapper
const ProtectedRoute = ({ element, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />; // Wait for auth check

  if (!user) return <Navigate to="/" replace />; // Redirect if not logged in

  if (role && !role.includes(user.role)) return <Navigate to="/" replace />; // Restrict by role

  return element;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LoginPage />} />

          { /* Accessible for Admins and Staffs */ }
          <Route path="/sales" element={<ProtectedRoute element={<SalesPage />} role={["admin", "staff"]}  />} />
          <Route path="/new-sales" element={<ProtectedRoute element={<NewSalesPage />} role={["admin", "staff"]} />} />
          <Route path="/inventory" element={<ProtectedRoute element={<InventoryPage />} role={["admin", "staff"]} />} />

          {/* Protected Admin Routes */}
          <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} role="admin" />} />
          <Route path="/reports" element={<ProtectedRoute element={<SalesPage />} role="admin" />} />
          <Route path="/expenses" element={<ProtectedRoute element={<ExpensesPage />} role="admin" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
