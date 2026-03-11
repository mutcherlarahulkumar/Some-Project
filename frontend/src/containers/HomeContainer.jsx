import { useAuth } from '../components/AuthProvider';

export default function HomeContainer() {
  const { user } = useAuth();

  const renderRoleInfo = () => {
    switch (user?.role) {
      case 'ADMIN':
        return (
          <div className="mt-4 p-4 bg-purple-50 text-purple-800 rounded border border-purple-200">
            <h3 className="font-bold">Admin Capabilities:</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
              <li>Manage all users across the platform.</li>
              <li>View system-wide analytics and revenue.</li>
              <li>Resolve disputes and manage maintenance tickets.</li>
              <li>Oversee all properties and bookings.</li>
            </ul>
          </div>
        );
      case 'HOST':
        return (
          <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded border border-blue-200">
            <h3 className="font-bold">Host Capabilities:</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
              <li>Create, edit, and manage your properties.</li>
              <li>Manage your property availability calendar.</li>
              <li>Approve or decline bookings from guests.</li>
              <li>Create maintenance requests for your properties.</li>
            </ul>
          </div>
        );
      case 'GUEST':
        return (
          <div className="mt-4 p-4 bg-green-50 text-green-800 rounded border border-green-200">
            <h3 className="font-bold">Guest Capabilities:</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
              <li>Browse properties and create bookings.</li>
              <li>Make payments for your bookings.</li>
              <li>Leave reviews for properties you've stayed at.</li>
              <li>Open disputes for problematic bookings.</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
        <h2 className="text-xl font-semibold mb-2">Welcome back, {user?.fullName || 'User'}!</h2>
        <p className="text-gray-600">You are logged in as a <strong>{user?.role}</strong>.</p>

        {renderRoleInfo()}

      </div>
    </div>
  );
}
