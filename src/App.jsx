import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Reports from "./pages/Reports";
import Inventory from "./pages/Inventory";
import Transaction from "./pages/Transaction";
import UserList from "./pages/UserList";
import ProtectedRoute from "./ProtectedRoute";
import StaffInventory from "./pages/StaffInventory";
import StaffTransaction from "./pages/StaffTransaction";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Reports />
            </ProtectedRoute>
          } />
        <Route 
          path="/inventory" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Inventory />
            </ProtectedRoute>
          } />
        <Route 
          path="/transactions" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Transaction />
            </ProtectedRoute>
          } />
        <Route 
          path="/user-list" 
          element={
            <ProtectedRoute requiredRole="admin">
              <UserList />
            </ProtectedRoute>
          } />
        <Route 
          path="/staff-inventory" 
          element={
            <ProtectedRoute requiredRole="staff">
              <StaffInventory />
            </ProtectedRoute>
          } />
        <Route 
          path="/staff-transaction" 
          element={
            <ProtectedRoute requiredRole="staff">
              <StaffTransaction />
            </ProtectedRoute>
          } />
      </Routes>
    </Router>
  );
}

export default App;
