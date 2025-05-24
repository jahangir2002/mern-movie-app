import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Search from './pages/Search';
import AddMovie from './pages/AddMovie';
import EditMovie from './pages/EditMovie';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<Search />} />
            <Route
              path="/add-movie"
              element={
                <ProtectedRoute role="admin">
                  <AddMovie />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-movie/:id"
              element={
                <ProtectedRoute role="admin">
                  <EditMovie />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;