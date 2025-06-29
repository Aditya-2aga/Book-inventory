import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  User, 
  Calendar,
  MapPin,
  Plus,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { bookAPI } from '../utils/api';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    gradeLevel: '',
    subject: '',
    status: '',
    page: 1
  });

  useEffect(() => {
    fetchBooks();
  }, [filters]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookAPI.getAll(filters);
      setBooks(response.data.books || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      'checked-out': 'bg-blue-100 text-blue-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      lost: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const BookCard = ({ book }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link 
            to={`/books/${book._id}`}
            className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2"
          >
            {book.title}
          </Link>
          <p className="text-gray-600 mt-1 flex items-center">
            <User className="h-4 w-4 mr-1" />
            {book.author}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        {book.gradeLevel && (
          <div className="flex items-center">
            <span className="font-medium w-20">Grade:</span>
            <span>{book.gradeLevel}</span>
          </div>
        )}
        {book.subject && (
          <div className="flex items-center">
            <span className="font-medium w-20">Subject:</span>
            <span>{book.subject}</span>
          </div>
        )}
        {book.location && (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
            <span>{book.location}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
          {book.status.replace('-', ' ').toUpperCase()}
        </span>
        <span className="text-xs text-gray-500">
          <Calendar className="h-3 w-3 inline mr-1" />
          {new Date(book.createdAt).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Books</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchBooks}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Library</h1>
          <p className="text-lg text-gray-600 mt-2">
            Browse and manage your book collection
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <Link
            to="/add-book"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Book
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search books..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Grade Level Filter */}
          <select
            value={filters.gradeLevel}
            onChange={(e) => handleFilterChange('gradeLevel', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">All Grade Levels</option>
            <option value="K-2">K-2</option>
            <option value="3-5">3-5</option>
            <option value="6-8">6-8</option>
            <option value="9-12">9-12</option>
            <option value="Adult">Adult</option>
          </select>

          {/* Subject Filter */}
          <select
            value={filters.subject}
            onChange={(e) => handleFilterChange('subject', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">All Subjects</option>
            <option value="Fiction">Fiction</option>
            <option value="Science">Science</option>
            <option value="Math">Math</option>
            <option value="History">History</option>
            <option value="English">English</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="checked-out">Checked Out</option>
            <option value="maintenance">Maintenance</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600 mb-6">
            {filters.search || filters.gradeLevel || filters.subject || filters.status
              ? 'Try adjusting your filters'
              : 'Start building your library by adding your first book'
            }
          </p>
          <Link
            to="/add-book"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Book
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, index) => (
            <motion.div
              key={book._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BookCard book={book} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;