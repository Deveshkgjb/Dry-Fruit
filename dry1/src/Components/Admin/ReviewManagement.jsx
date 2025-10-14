import React, { useState, useEffect } from 'react';
import { reviewsAPI } from '../../services/api.js';
import { useNotification } from '../Common/NotificationProvider.jsx';

const ReviewManagement = () => {
  const { showSuccess, showError } = useNotification();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });

  // Fetch reviews from backend
  const fetchReviews = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching reviews from backend...');
      
      const response = await reviewsAPI.getAll({
        page: 1,
        limit: 100,
        sort: 'createdAt',
        order: 'desc'
      });
      
      console.log('📄 Reviews fetched:', response);
      setReviews(response.reviews || []);
      
      // Calculate stats
      const total = response.reviews?.length || 0;
      const approved = response.reviews?.filter(r => r.status === 'approved').length || 0;
      const pending = response.reviews?.filter(r => r.status === 'pending').length || 0;
      const rejected = response.reviews?.filter(r => r.status === 'rejected').length || 0;
      
      setStats({ total, approved, pending, rejected });
      
    } catch (error) {
      console.error('❌ Error fetching reviews:', error);
      showError('Failed to fetch reviews from database. Please check your connection and admin token.');
      
      // No fallback to mock data - keep empty state to force database connection
      setReviews([]);
      setStats({ total: 0, approved: 0, pending: 0, rejected: 0 });
    }
  };

  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRating, setFilterRating] = useState('All');

  // Load reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStatusChange = async (reviewId, newStatus) => {
    try {
      console.log(`🔄 Updating review ${reviewId} status to ${newStatus}...`);
      
      // Use API for database reviews only
      const response = await reviewsAPI.updateStatus(reviewId, { status: newStatus.toLowerCase() });
      console.log('✅ Review status updated:', response);
      
      showSuccess(`Review ${newStatus} successfully`);
      
      // Update local state
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review._id === reviewId 
            ? { ...review, status: newStatus.toLowerCase() }
            : review
        )
      );
      
      // Update stats
      setStats(prevStats => {
        const newStats = { ...prevStats };
        const review = reviews.find(r => r._id === reviewId);
        if (review) {
          // Remove from old status count
          if (review.status === 'approved') newStats.approved--;
          else if (review.status === 'pending') newStats.pending--;
          else if (review.status === 'rejected') newStats.rejected--;
          
          // Add to new status count
          if (newStatus.toLowerCase() === 'approved') newStats.approved++;
          else if (newStatus.toLowerCase() === 'pending') newStats.pending++;
          else if (newStatus.toLowerCase() === 'rejected') newStats.rejected++;
        }
        return newStats;
      });
      
    } catch (error) {
      console.error('❌ Error updating review status:', error);
      showError('Failed to update review status');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    try {
      console.log(`🗑️ Deleting review ${reviewId}...`);
      
      // Use API for database reviews only
      await reviewsAPI.delete(reviewId);
      console.log('✅ Review deleted successfully');
      
      showSuccess('Review deleted successfully');
      
      // Update local state
      setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));
      
      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        total: prevStats.total - 1
      }));
      
    } catch (error) {
      console.error('❌ Error deleting review:', error);
      showError('Failed to delete review');
    }
  };


  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ⭐
      </span>
    ));
  };

  const filteredReviews = reviews.filter(review => {
    // Handle both API data (lowercase status) and mock data (capitalized status)
    const reviewStatus = review.status;
    const normalizedStatus = reviewStatus.charAt(0).toUpperCase() + reviewStatus.slice(1).toLowerCase();
    
    const statusMatch = filterStatus === 'All' || 
                       reviewStatus === filterStatus || 
                       normalizedStatus === filterStatus;
    const ratingMatch = filterRating === 'All' || review.rating.toString() === filterRating;
    return statusMatch && ratingMatch;
  });

  const reviewStats = {
    total: reviews.length,
    approved: reviews.filter(r => r.status === 'Approved' || r.status === 'approved').length,
    pending: reviews.filter(r => r.status === 'Pending' || r.status === 'pending').length,
    rejected: reviews.filter(r => r.status === 'Rejected' || r.status === 'rejected').length,
    avgRating: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="ml-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Review Management</h2>
        <button
          onClick={fetchReviews}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Refresh Reviews
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{reviewStats.total}</div>
          <div className="text-sm text-blue-800">Total Reviews</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{reviewStats.approved}</div>
          <div className="text-sm text-green-800">Approved</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{reviewStats.pending}</div>
          <div className="text-sm text-yellow-800">Pending</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{reviewStats.rejected}</div>
          <div className="text-sm text-red-800">Rejected</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{reviewStats.avgRating}</div>
          <div className="text-sm text-purple-800">Avg Rating</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Filter by Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="All">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Filter by Rating</label>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="All">All Reviews</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{review.productName}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(review.status)}`}>
                    {review.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span><strong>Customer:</strong> {review.customerName}</span>
                  <span><strong>Date:</strong> {review.date}</span>
                </div>
                <div className="flex items-center mb-3">
                  {renderStars(review.rating)}
                  <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                </div>
                <p className="text-gray-700 mb-4">{review.comment}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {review.status !== 'Approved' && (
                <button
                  onClick={() => handleStatusChange(review.id, 'Approved')}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  Approve
                </button>
              )}
              {review.status !== 'Rejected' && (
                <button
                  onClick={() => handleStatusChange(review.id, 'Rejected')}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Reject
                </button>
              )}
              {review.status !== 'Pending' && (
                <button
                  onClick={() => handleStatusChange(review.id, 'Pending')}
                  className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                >
                  Mark Pending
                </button>
              )}
              <button
                onClick={() => handleDeleteReview(review.id)}
                className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No reviews found matching the selected filters.
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;
