import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token to "log out" the user
    localStorage.removeItem('token');

    // Redirect the user to the login page
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="border border-red-600 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
    >
      Logout
    </button>
  );
};

