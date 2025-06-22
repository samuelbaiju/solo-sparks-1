import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function HomePage() {
  const { user } = useContext(AuthContext);

  return (
    <div className="text-center">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Solo Sparks
        </span>
      </h1>
      <p className="text-xl text-gray-400 mb-8">
        Your journey of self-discovery starts here.
      </p>
      {user ? (
        <div>
          <p className="text-lg mb-4">You are logged in.</p>
          <Link 
            to="/dashboard" 
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="flex justify-center gap-4">
          <Link 
            to="/register" 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            Register
          </Link>
          <Link 
            to="/login" 
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default HomePage; 