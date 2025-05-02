import { Link } from "react-router";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from "react";
import { LogOut } from 'lucide-react';

const Header = () => {
    const [showModal, setShowModal] = useState(false);
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
        <div className="flex items-center justify-between h-13 w-full bg-primary sticky top-0 px-5 z-999">
            <Link to="/admin-dashboard">
                <img src="/images/Aqua2.png" alt="Logo" className="h-8 cursor-pointer" />
            </Link>
            <button 
                onClick={() => setShowModal(true)}
                className="text-white cursor-pointer px-4 py-2"
                aria-label="Logout">
                <LogOut size={20} />
            </button>

            {/* Logout Confirmation Modal */}
            <div
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }} 
            className={`fixed inset-0 flex items-center justify-center z-1000 transition-opacity duration-300 ${
                showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            >
            <div
                className={`bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 ${
                showModal ? 'scale-100' : 'scale-95'
                }`}
            >
                    <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
                    <p className="mb-6">Are you sure you want to log out?</p>
                    <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => setShowModal(false)} // Close modal
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleLogout} // Confirm logout
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Header;
