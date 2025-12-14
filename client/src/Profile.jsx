import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Fetch profile error:', err);
      }
    };

    fetchUser();
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-md">
          <p className="mb-4">You are not signed in.</p>
          <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-4 py-2 rounded">Sign in</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
        {user ? (
          <div className="space-y-3">
            <div>
              <strong>Name:</strong> {user.name}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Phone:</strong> {user.phone || '—'}
            </div>
            <div>
              <strong>Address:</strong> {user.address || '—'}
            </div>
            <div>
              <img
                src={
                  user.photo || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80'
                }
                alt="profile"
                className="w-32 h-32 object-cover rounded"
              />
            </div>

            {user.isAdmin && (
              <div className="bg-purple-100 border border-purple-400 text-purple-800 px-3 py-2 rounded text-sm font-bold text-center">
                👨‍💼 Admin Account
              </div>
            )}

            <div className="flex flex-col gap-2 mt-6">
              <button onClick={() => navigate('/complete-profile')} className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Edit Profile</button>
              {!user.isAdmin && (
                <button onClick={() => navigate('/my-requests')} className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">My Requests</button>
              )}
              {user.isAdmin && (
                <button onClick={() => navigate('/admin')} className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">📊 Admin Panel</button>
              )}
              <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} className="w-full bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition">Sign Out</button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
