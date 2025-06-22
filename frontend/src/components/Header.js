import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Header = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <div>
      <Link to="/">Home</Link>
      <span> | </span>
      <Link to="/dashboard">Dashboard</Link>
      <span> | </span>
      <Link to="/rewards">Rewards Store</Link>
      <span> | </span>
      <Link to="/my-reflections">My Reflections</Link>
      <span> | </span>
      {user ? (
        <>
          <span>Hello, {user.username}!</span>
          <button onClick={logoutUser}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
};

export default Header; 