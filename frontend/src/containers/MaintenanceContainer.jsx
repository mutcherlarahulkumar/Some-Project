import { useEffect, useState } from 'react';
import apiService from '../api/apiService';
import MaintenanceForm from '../components/forms/MaintenanceForm';
import { useAuth } from '../components/AuthProvider';

export default function MaintenanceContainer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const fetchMaintenance = () => {
    setLoading(true);
    apiService.getMaintenance()
      .then(res => setData(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Maintenance</h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded">
            Report Issue
          </button>
        )}
      </div>

      {showForm && (
        <MaintenanceForm
          onSuccess={() => { setShowForm(false); fetchMaintenance(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading && !showForm ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.length === 0 ? <p className="text-gray-500">No maintenance requests found.</p> : data.map((req, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow border border-gray-100 border-l-4 border-l-yellow-500">
              <div className="flex justify-between">
                <h3 className="font-bold text-lg">{req.title || req.issueType}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    req.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                    req.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                  {req.status || 'OPEN'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2">{req.description}</p>
              <div className="mt-4 text-xs text-gray-400">
                Property ID: {req.propertyId} {req.bookingId && `| Booking ID: ${req.bookingId}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
