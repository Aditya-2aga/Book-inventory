import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Plus, 
  TrendingUp, 
  Users, 
  Clock,
  ArrowRight,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { bookAPI } from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await bookAPI.getStats();
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {loading ? '...' : value || 0}
          </p>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const QuickAction = ({ title, description, to, icon: Icon, color }) => (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-gray-400 mt-4 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
      </motion.div>
    </Link>
  );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center lg:text-left">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900"
        >
          Dashboard
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 mt-2"
        >
          Manage your digital book collection with AI-powered tools
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Books"
          value={stats?.totalBooks}
          icon={BookOpen}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          description="Books in collection"
        />
        <StatCard
          title="Available"
          value={stats?.availableBooks}
          icon={Users}
          color="bg-gradient-to-r from-green-500 to-green-600"
          description="Ready to check out"
        />
        <StatCard
          title="Checked Out"
          value={stats?.checkedOutBooks}
          icon={Clock}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          description="Currently borrowed"
        />
        <StatCard
          title="Maintenance"
          value={(stats?.totalBooks || 0) - (stats?.availableBooks || 0) - (stats?.checkedOutBooks || 0)}
          icon={BarChart3}
          color="bg-gradient-to-r from-yellow-500 to-yellow-600"
          description="Needs attention"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuickAction
          title="Add New Book"
          description="Use AI to extract book details from photos"
          to="/add-book"
          icon={Plus}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <QuickAction
          title="Browse Library"
          description="View and manage your book collection"
          to="/books"
          icon={BookOpen}
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <QuickAction
          title="Configure Settings"
          description="Set up API keys and preferences"
          to="/settings"
          icon={BarChart3}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
      </div>

      {/* Recent Books & Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Books */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Books</h2>
            <Link 
              to="/books" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            ) : stats?.recentBooks?.length > 0 ? (
              stats.recentBooks.map((book) => (
                <div key={book._id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {book.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      by {book.author} • {new Date(book.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p>No books added yet</p>
                <Link 
                  to="/add-book" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                >
                  Add your first book
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Top Subjects */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Top Subjects</h2>
            <Link 
              to="/books" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded w-full mt-2"></div>
                </div>
              ))
            ) : stats?.topSubjects?.length > 0 ? (
              stats.topSubjects.map((subject, index) => (
                <div key={subject._id || index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {subject._id || 'Unknown'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {subject.count} book{subject.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${(subject.count / (stats?.totalBooks || 1)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p>No subject data available</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;