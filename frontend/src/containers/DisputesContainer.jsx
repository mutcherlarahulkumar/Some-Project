import { useEffect, useState } from 'react';
import apiService from '../api/apiService';
import DisputeForm from '../components/forms/DisputeForm';
import { useAuth } from '../components/AuthProvider';

export default function DisputesContainer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const fetchDisputes = () => {
    setLoading(true);
    apiService.getDisputes()
      .then(res => setData(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Disputes</h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
            File Dispute
          </button>
        )}
      </div>

      {showForm && (
        <DisputeForm
          onSuccess={() => { setShowForm(false); fetchDisputes(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading && !showForm ? <p>Loading...</p> : (
        <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
          {data.length === 0 ? <p className="text-gray-500">No active disputes.</p> : (
            <ul className="divide-y divide-gray-200">
              {data.map((d, i) => (
                <li key={i} className="py-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-lg">{d.title || d.type}</p>
                      <p className="text-sm text-gray-500 mt-1">Booking ID: {d.bookingId}</p>
                    </div>
                    <div>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                          d.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                          d.status === 'IN_REVIEW' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {d.status || 'OPEN'}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-3 bg-gray-50 p-3 rounded">{d.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
