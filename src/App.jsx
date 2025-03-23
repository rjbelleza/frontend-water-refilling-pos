import { BrowserRouter as Router, Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSales from "./pages/AdminSales";


const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-sales" element={<AdminSales />} />
      </Routes>
    </Router>
  );
}

export default App;
