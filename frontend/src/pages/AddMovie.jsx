import { useState } from 'react';
import axios from 'axios';

const AddMovie = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rating: '',
    releaseDate: '',
    duration: '',
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/movies', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Movie added to queue');
      setFormData({ title: '', description: '', rating: '', releaseDate: '', duration: '' });
    } catch (err) {
      alert('Error adding movie');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add Movie</h1>
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
          value={formData.releaseDate}
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
          Add Movie
        </button>
      </form>
    </div>
  );
};

export default AddMovie;