import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rating: '',
    releaseDate: '',
    duration: '',
  });

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await axios.get(`http://localhost:5000/api/movies/${id}`);
      setFormData(res.data);
    };
    fetchMovie();
  }, [id]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/movies/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Movie updated');
      navigate('/');
    } catch (err) {
      alert('Error updating movie');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await axios.delete(`http://localhost:5000/api/movies/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        alert('Movie deleted');
        navigate('/');
      } catch (err) {
        alert('Error deleting movie');
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Movie</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="border p-2 w-full"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          placeholder="Rating (0-10)"
          className="border p-2 w-full"
          min="0"
          max="10"
        />
        <input
          type="date"
          name="releaseDate"
          value={formData.releaseDate?.split('T')[0]}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="Duration (minutes)"
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Update Movie
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="bg-red-500 text-white p-2 ml-2"
        >
          Delete Movie
        </button>
      </form>
    </div>
  );
};

export default EditMovie;