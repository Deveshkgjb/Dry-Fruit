import React, { useState } from 'react';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      productName: "Happilo Roasted & Lightly Salted Premium California Almonds",
      customerName: "Rahul Sharma",
      rating: 5,
      comment: "Excellent quality almonds! Fresh, crunchy, and perfectly salted. Will definitely order again.",
      date: "2024-01-15",
      status: "Approved",
      productId: 1
    },
    {
      id: 2,
      productName: "Happilo Premium Whole Cashew Nuts",
      customerName: "Priya Patel",
      rating: 4,
      comment: "Good taste and quality. Packaging is also nice. Slightly expensive but worth it.",
      date: "2024-01-10",
      status: "Approved",
      productId: 2
    },
    {
      id: 3,
      productName: "Happilo Premium Dried Blueberry",
      customerName: "Amit Kumar",
      rating: 2,
      comment: "Poor quality product. Very disappointed with the purchase.",
      date: "2024-01-08",
      status: "Pending",
      productId: 3
    },
    {
      id: 4,
      productName: "Happilo Roasted & Lightly Salted Premium California Almonds",
      customerName: "Sneha Reddy",
      rating: 1,
      comment: "Worst product ever. Don't buy this.",
      date: "2023-12-28",
      status: "Rejected",
      productId: 1
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRating, setFilterRating] = useState('All');

  const handleStatusChange = (reviewId, newStatus) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, status: newStatus }
        : review
    ));
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews(reviews.filter(review => review.id !== reviewId));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
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
    const statusMatch = filterStatus === 'All' || review.status === filterStatus;
    const ratingMatch = filterRating === 'All' || review.rating.toString() === filterRating;
    return statusMatch && ratingMatch;
  });

  const reviewStats = {
    total: reviews.length,
    approved: reviews.filter(r => r.status === 'Approved').length,
    pending: reviews.filter(r => r.status === 'Pending').length,
    rejected: reviews.filter(r => r.status === 'Rejected').length,
    avgRating: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Review Management</h2>
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
            <option value="All">All Ratings</option>
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
