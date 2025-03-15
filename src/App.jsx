import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Reports from "./pages/Reports";
import Inventory from "./pages/Inventory";
import OrderHistory from "./pages/OrderHistory";
import UserList from "./pages/UserList";

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/user-list" element={<UserList />} />
      </Routes>
    </Router>
  );
}

export default App;
