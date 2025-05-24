const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
      <div className="flex justify-center space-x-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {page}
          </button>
        ))}
      </div>
    );
  };
  
  export default Pagination;