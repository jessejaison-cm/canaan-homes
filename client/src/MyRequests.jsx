import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchRequests = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/booking/my-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setRequests(data);
        } else {
          console.error('Failed to fetch requests');
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    return type === 'Book' ? 'text-blue-600' : 'text-green-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading your requests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">My Booking & Purchase Requests</h2>

        {requests.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600 text-lg mb-4">You haven't submitted any requests yet.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Browse Listings
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request._id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{request.listingTitle}</h3>
                    <p className="text-gray-600">{request.listingPrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Request Type:</strong> <span className={`font-bold ${getTypeColor(request.requestType)}`}>{request.requestType}</span>
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Status:</strong>
                    </p>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(request.status)}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Submitted:</strong> {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Contact:</strong> {request.phone}
                    </p>
                  </div>
                </div>

                {request.message && (
                  <div className="bg-gray-50 p-3 rounded mb-4">
                    <p className="text-sm text-gray-700">
                      <strong>Message:</strong> {request.message}
                    </p>
                  </div>
                )}

                <div className="border-t pt-4 text-sm text-gray-600">
                  <p><strong>Name:</strong> {request.name}</p>
                  <p><strong>Email:</strong> {request.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="mt-8 text-blue-600 hover:text-blue-800 underline"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default MyRequests;
