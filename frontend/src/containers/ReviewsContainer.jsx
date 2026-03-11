import { useEffect, useState } from 'react';
import apiService from '../api/apiService';
import ReviewForm from '../components/forms/ReviewForm';
import { useAuth } from '../components/AuthProvider';

export default function ReviewsContainer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [propertyId, setPropertyId] = useState(1);
  const { user } = useAuth();

  const fetchReviews = () => {
    setLoading(true);
    apiService.getReviews(propertyId)
      .then(res => setData(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, [propertyId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
            Add Review
          </button>
        )}
      </div>

      {showForm && (
        <ReviewForm
          onSuccess={() => { setShowForm(false); fetchReviews(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading && !showForm ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.length === 0 ? <p className="text-gray-500">No reviews found.</p> : data.map((r, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center mb-4 space-x-2">
                  <span className="text-yellow-400 text-xl">{'★'.repeat(Math.round(r.rating || 5))}</span>
                  <span className="text-gray-500 text-sm font-semibold">{r.rating} / 5</span>
                </div>
                <p className="text-gray-600 italic">"{r.comment}"</p>
              </div>
              <div className="mt-4 pt-4 border-t text-xs text-gray-400 flex justify-between">
                 <span>Reviewer: {r.reviewerId || 'Anonymous'}</span>
                 <span>Booking ID: {r.bookingId}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
