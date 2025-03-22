import { BrowserRouter as Router, Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";


const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
