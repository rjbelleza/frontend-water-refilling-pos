import React, { useState } from 'react';
import { useUser } from '../components/UserContext';
import { useNavigate } from 'react-router';

const Logout = () => {
  const { logout } = useUser();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <>
      {/* Logout Button */}
      <button
        onClick={() => setShowModal(true)} // Show modal on click
        className="text-white cursor-pointer"
      >
        Logout
      </button>

      {/* Logout Confirmation Modal */}
      <div
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }} // Inline style for background opacity
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
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout} // Confirm logout
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Header = () => {
  return (
    <div className="flex items-center justify-between h-[60px] w-full fixed top-0 bg-primary px-20 z-100">
      <div className="flex text-[#74edeb] text-[20px] cursor-pointer">
        Aqua<p className="font-bold text-white">SPRINGS</p>
      </div>
      <Logout />
    </div>
  );
};

export default Header;
