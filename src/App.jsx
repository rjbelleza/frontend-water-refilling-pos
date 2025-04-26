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
import UsersPage from "./pages/UsersPage";
import NetProfit from "./pages/NetProfit";

// Protected Route Wrapper
const ProtectedRoute = ({ element, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />; // 

  if (!user) return <Navigate to="/" replace />; 

  if (role && !role.includes(user.role)) return <Navigate to="/" replace />; 

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
          <Route path="/reports" element={<ProtectedRoute element={<ReportsPage />} role="admin" />} />
          <Route path="/expenses" element={<ProtectedRoute element={<ExpensesPage />} role="admin" />} />
          <Route path="/users" element={<ProtectedRoute element={<UsersPage />} role="admin" />} />
          <Route path="/netProfit" element={<ProtectedRoute element={<NetProfit />} role="admin" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
