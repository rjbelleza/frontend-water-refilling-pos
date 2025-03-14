import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
