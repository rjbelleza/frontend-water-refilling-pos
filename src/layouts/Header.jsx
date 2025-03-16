import React from 'react';
import { useUser } from '../components/UserContext';
import { useNavigate } from 'react-router';


const Logout = () => {
    const { logout } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to home page after logout
      };

    return <button onClick={handleLogout} className="text-white cursor-pointer">Logout</button>
}


const Header = () => {

    return (
        <div className="flex items-center justify-between h-[60px] w-full fixed top-0 bg-primary px-20 z-100">
            <div className="flex text-[#74edeb] text-[20px] cursor-pointer">
                Aqua<p className="font-bold text-white">SPRINGS</p>
            </div>
            <Logout />
        </div>
    );
}

export default Header;
