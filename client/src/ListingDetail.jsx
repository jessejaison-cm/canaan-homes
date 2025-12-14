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
      console.error('Submit error:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  if (!listing) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-3xl font-bold text-red-600">Listing not found</h2>
        <Link to="/" className="text-blue-600 underline">← Back to home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10">
      <Link to="/" className="text-blue-600 underline mb-4 inline-block">← Back to Home</Link>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        {/* Listing Image and Details */}
        <div className="md:col-span-2">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-96 object-cover rounded-lg shadow-md mb-6"
          />
          <h2 className="text-4xl font-bold text-gray-800 mb-2">{listing.title}</h2>
          <p className="text-2xl text-green-600 font-bold mb-4">{listing.price}</p>
          <p className="text-gray-700 text-lg mb-6">{listing.fullDescription}</p>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => {
                setActionType('Book');
                document.getElementById('inquiry-form').scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-bold text-lg"
            >
              📅 Book Now
            </button>
            <button
              onClick={() => {
                setActionType('Buy');
                document.getElementById('inquiry-form').scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-bold text-lg"
            >
              🏠 Buy Now
            </button>
          </div>
        </div>

        {/* Inquiry Form */}
        <div id="inquiry-form" className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">
            {actionType ? `${actionType} This Property` : 'Get More Info'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="+971 50 123 4567"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Message (optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Tell us more about your interest..."
                rows="3"
              ></textarea>
            </div>
            {actionType && (
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-bold"
              >
                Submit {actionType} Request
              </button>
            )}
            {!actionType && (
              <p className="text-sm text-gray-500 text-center">Click Book or Buy above to submit a request</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ListingDetail;
