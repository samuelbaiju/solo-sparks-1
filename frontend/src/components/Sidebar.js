import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Sidebar = () => {
  const { user, userProfile, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };
  
  const linkClasses = "flex items-center px-4 py-2 mt-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-200";
  const activeLinkClasses = "bg-gray-700 text-white";

  return (
    <div className="flex flex-col w-64 bg-gray-800 border-r border-gray-700">
        <div className="flex items-center justify-center h-20 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white">Solo Sparks</h1>
        </div>
        <nav className="flex-grow px-4 py-4">
            <NavLink to="/dashboard" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                Dashboard
            </NavLink>
            <NavLink to="/rewards" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                Rewards Store
            </NavLink>
            <NavLink to="/my-reflections" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                My Reflections
            </NavLink>
        </nav>
        <div className="border-t border-gray-700 p-4">
            <div className="text-center mb-4">
                <p className="font-semibold text-white">{user.username}</p>
                <p className="text-sm text-yellow-400">{userProfile?.spark_points ?? 0} Spark Points</p>
            </div>
            <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
            >
                Logout
            </button>
        </div>
    </div>
  );
};

export default Sidebar; 