import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchAllRequests = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/booking/all-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setRequests(data);
        } else if (res.status === 403) {
          alert('Access denied. Admin access required.');
          navigate('/');
        } else {
          alert('Failed to fetch requests');
          navigate('/');
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRequests();
  }, [token, navigate]);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/booking/update-status/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setRequests(requests.map((req) => (req._id === id ? data.request : req)));
        alert('Status updated successfully');
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const filteredRequests = filter === 'all' ? requests : requests.filter((r) => r.status === filter);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Admin Panel - All Booking Requests</h2>

        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-300'
            }`}
          >
            All ({requests.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-800 border border-gray-300'
            }`}
          >
            Pending ({requests.filter((r) => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('contacted')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              filter === 'contacted' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-300'
            }`}
          >
            Contacted ({requests.filter((r) => r.status === 'contacted').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              filter === 'approved' ? 'bg-green-600 text-white' : 'bg-white text-gray-800 border border-gray-300'
            }`}
          >
            Approved ({requests.filter((r) => r.status === 'approved').length})
          </button>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600 text-lg">No requests found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">Listing</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">User</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">Contact</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-800">{request.listingTitle}</div>
                      <div className="text-xs text-gray-600">{request.listingPrice}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${request.requestType === 'Book' ? 'text-blue-600' : 'text-green-600'}`}>
                        {request.requestType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-800">{request.name}</div>
                      <div className="text-xs text-gray-600">{request.userId?.name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-800">{request.phone}</div>
                      <div className="text-xs text-gray-600">{request.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={request.status}
                        onChange={(e) => updateStatus(request._id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded text-sm cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-x-1"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;
