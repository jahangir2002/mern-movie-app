import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <div className="bg-white shadow-md rounded p-4">
      <h3 className="text-lg font-bold">{movie.title}</h3>
      <p>{movie.description}</p>
      <p>Rating: {movie.rating}</p>
      <p>Release Date: {new Date(movie.releaseDate).toLocaleDateString()}</p>
      <p>Duration: {movie.duration} mins</p>
      <Link to={`/edit-movie/${movie._id}`} className="text-blue-500">Edit</Link>
    </div>
  );
};

export default MovieCard;