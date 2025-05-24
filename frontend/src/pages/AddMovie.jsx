import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddMovie = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rating: '',
    releaseDate: '',
    duration: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token || !user || user.role !== 'admin') {
        setError('You must be logged in as an admin');
        return;
      }
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/movies`,
        {
          title: formData.title,
          description: formData.description,
          rating: parseFloat(formData.rating),
          releaseDate: formData.releaseDate,
          duration: parseInt(formData.duration),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Movie added successfully!');
      setError(null);
      setFormData({ title: '', description: '', rating: '', releaseDate: '', duration: '' });
      setTimeout(() => navigate('/'), 2000); // Redirect to homepage after 2s
    } catch (err) {
      console.error('Add movie error:', err);
      setError(err.response?.data?.message || 'Failed to add movie. Please try again.');
      setSuccess(null);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Add New Movie</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Rating (0-10)</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="border p-2 w-full"
            min="0"
            max="10"
            step="0.1"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Release Date</label>
          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="border p-2 w-full"
            min="1"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          Add Movie
        </button>
      </form>
    </div>
  );
};

export default AddMovie;