import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-gray-300">Home</Link>
          <Link to="/search" className="text-white hover:text-gray-300">Search</Link>
          {user?.role === 'admin' && (
            <Link to="/add-movie" className="text-white hover:text-gray-300">Add Movie</Link>
          )}
        </div>
        <div>
          {user ? (
            <button onClick={handleLogout} className="text-white hover:text-gray-300">
              Logout
            </button>
          ) : (
            <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;