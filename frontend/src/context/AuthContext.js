import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
  const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access) : null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const loginUser = async (username, password) => {
    setError(null);
    try {
      const response = await axios.post('/api/token/', {
        username,
        password,
      });
      if (response.status === 200) {
        const data = response.data;
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem('authTokens', JSON.stringify(data));
        await fetchUserProfile(data.access);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('authTokens');
    navigate('/login');
  };

  const fetchUserProfile = async (accessToken) => {
    try {
      const response = await axios.get('/api/profile/', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setUserProfile(response.data);
    } catch (e) {
      console.error('Failed to fetch user profile', e);
      // Maybe logout user if profile fetch fails
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      if (authTokens) {
        await fetchUserProfile(authTokens.access);
      }
      setLoading(false);
    };
    bootstrap();
  }, []);

  const contextData = {
    user,
    userProfile,
    authTokens,
    error,
    loginUser,
    logoutUser,
    fetchUserProfile,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
}; 