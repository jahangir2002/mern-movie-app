import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await axios.get(`http://localhost:5000/api/movies?page=${currentPage}&limit=10`);
      setMovies(res.data.movies || []);
      setTotalPages(res.data.totalPages || 1);
    };
    fetchMovies();
  }, [currentPage]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Top 250 Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {movies.map(movie => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default Home;