import { Link } from "react-router";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/'); // Redirect only if logout is successful
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Logout failed. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-between h-15 w-full bg-primary-500 fixed top-0 z-100 px-5">
            <Link to="/admin-dashboard">
                <img src="/images/Aqua2.png" alt="Logo" className="h-10 cursor-pointer" />
            </Link>
            <button 
                onClick={handleLogout}
                className="text-white cursor-pointer px-4 py-2 bg-red-500 rounded hover:bg-red-600"
                aria-label="Logout">
                Logout
            </button>
        </div>
    );
};

export default Header;
