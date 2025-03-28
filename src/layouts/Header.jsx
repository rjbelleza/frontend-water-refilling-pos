import { Link } from "react-router";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();


    const handleLogout = async () => {
        await logout();
        navigate('/');
    };


    return (
        <div className="flex items-center justify-between h-15 w-full bg-primary-500 fixed top-0 z-100">
            <Link to="/admin-dashboard">
                <img src="/images/Aqua2.png" alt="logo" className="h-10 ml-15 cursor-pointer" />
            </Link>
            <button 
                onClick={handleLogout}
                className="text-white mr-15 cursor-pointer">Logout</button>
        </div>
    );
}

export default Header;
