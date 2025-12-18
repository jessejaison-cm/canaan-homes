
// ListingDetail.jsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { listings } from './data';

function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const listing = listings.find((item) => item.id === id);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [actionType, setActionType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert('Please fill in all fields');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to submit a request');
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/booking/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listingId: listing.id,
          listingTitle: listing.title,
          listingPrice: listing.price,
          requestType: actionType,
          name,
          email,
          phone,
          message,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`${actionType} request submitted successfully!\nWe will contact you soon at ${email}`);
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
        setActionType('');
      } else {
        alert(data.msg || 'Failed to submit request');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    }
  };

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <h2 className="text-3xl font-bold">Listing not found</h2>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      
      {/* ===== Animated Shapes ===== */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-3xl animate-[float1_18s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/30 rounded-full blur-3xl animate-[float2_22s_ease-in-out_infinite]" />
      <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-2xl animate-[float3_16s_ease-in-out_infinite]" />

      {/* ===== Content ===== */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        <Link
          to="/"
          className="inline-block mb-6 px-5 py-2 rounded-xl bg-white/10 backdrop-blur text-white hover:bg-white/20 transition"
        >
          ← Back to Home
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Listing */}
          <div className="md:col-span-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6">
            <div className="overflow-hidden rounded-xl mb-6">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-96 object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
              {listing.title}
            </h2>
            <p className="text-2xl font-bold text-emerald-600 mb-4">
              {listing.price}
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {listing.fullDescription}
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setActionType('Book');
                  document.getElementById('inquiry-form').scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:scale-[1.02] transition"
              >
                📅 Book Now
              </button>

              <button
                onClick={() => {
                  setActionType('Buy');
                  document.getElementById('inquiry-form').scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold hover:scale-[1.02] transition"
              >
                🏠 Buy Now
              </button>
            </div>
          </div>

          {/* Form */}
          <div
            id="inquiry-form"
            className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6"
          >
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              {actionType ? `${actionType} This Property` : 'Get More Info'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />

              <textarea
                rows="3"
                placeholder="Message (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              {actionType && (
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:scale-[1.02] transition"
                >
                  Submit {actionType} Request
                </button>
              )}

              {!actionType && (
                <p className="text-sm text-gray-500 text-center">
                  Click Book or Buy above
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* ===== Animations ===== */}
      <style>
        {`
          @keyframes float1 {
            0%,100% { transform: translate(0,0); }
            50% { transform: translate(80px, 60px); }
          }
          @keyframes float2 {
            0%,100% { transform: translate(0,0); }
            50% { transform: translate(-100px, -60px); }
          }
          @keyframes float3 {
            0%,100% { transform: translate(0,0); }
            50% { transform: translate(60px, -80px); }
          }
        `}
      </style>
    </div>
  );
}

export default ListingDetail;
