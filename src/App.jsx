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

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
        <Route path="/reports" element={<Reports />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/transactions" element={<Transaction />} />
        <Route path="/user-list" element={<UserList />} />
        <Route path="/staff-inventory" element={<StaffInventory />} />
        <Route path="/staff-transaction" element={<StaffTransaction />} />
      </Routes>
    </Router>
  );
}

export default App;
