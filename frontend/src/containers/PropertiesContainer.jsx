import { useEffect, useState } from 'react';
import apiService from '../api/apiService';
import PropertyForm from '../components/forms/PropertyForm';
import { useAuth } from '../components/AuthProvider';

export default function PropertiesContainer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const { user } = useAuth();

  const fetchProperties = () => {
    setLoading(true);
    apiService.getProperties()
      .then(res => setData(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleEdit = (prop) => {
    setEditingProperty(prop);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingProperty(null);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
        {(user?.role === 'HOST' || user?.role === 'ADMIN') && !showForm && (
          <button onClick={handleAddNew} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-medium">
            Add Property
          </button>
        )}
      </div>

      {showForm && (
        <PropertyForm
          onSuccess={() => { setShowForm(false); setEditingProperty(null); fetchProperties(); }}
          onCancel={() => { setShowForm(false); setEditingProperty(null); }}
          initialData={editingProperty}
          isEdit={!!editingProperty}
        />
      )}

      {loading && !showForm ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.length === 0 ? <p className="text-gray-500">No properties found.</p> : data.map((prop, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold">{prop.title}</h3>
                  {(user?.role === 'HOST' || user?.role === 'ADMIN') && (
                    <button onClick={() => handleEdit(prop)} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium ml-2">Edit</button>
                  )}
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase mt-1">{prop.propertyType}</p>
                <p className="text-gray-600 mt-2 text-sm">{prop.addressLine1}, {prop.city}</p>
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm">
                 <span className="font-bold text-indigo-600">₹{prop.basePrice} / night</span>
                 <span>🛏️ {prop.bedrooms} | 🚿 {prop.bathrooms}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
