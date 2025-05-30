import { useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';

const Search = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      setError(null);
      if (!query.trim()) {
        setError('Please enter a search query');
        setMovies([]);
        return;
      }
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/movies/search?q=${encodeURIComponent(query)}`);
      console.log('Search response:', res.data); // Debug log
      const data = Array.isArray(res.data) ? res.data : [];
      setMovies(data);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to search movies. Please try again.');
      setMovies([]);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Search Movies</h1>
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or description"
          className="border p-2 mr-2"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white p-2">
          Search
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {movies.length === 0 && !error && <p className="text-gray-500 mb-4">No movies found.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.isArray(movies) && movies.map(movie => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Search;