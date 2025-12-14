import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { listings } from './data';

import './App.css';
import ListingCard from './ListingCard';

export default function Home() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredListings, setFilteredListings] = useState(listings);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    // Fetch user details if token exists
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.name) setUser(data);
        })
        .catch((err) => {
          console.error('Error fetching user:', err);
        });
    }
  }, []);

  // Filter listings based on search query
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = listings.filter((listing) =>
      listing.title.toLowerCase().includes(query) ||
      listing.description.toLowerCase().includes(query) ||
      listing.price.toLowerCase().includes(query)
    );
    setFilteredListings(filtered);
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.reload(); // Refresh to reflect logout
  };

  const navigate = useNavigate();

  return (
    <>
      {/* Header / Navbar */}
      <header className="bg-white shadow-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
          {/* Logo and Company Name */}
          <div className="flex items-center space-x-2">
            <img src="/bg-home.jpg" alt="Company Logo" className="w-10 h-10 object-cover rounded-full" />
            <h1 className="text-xl font-bold text-gray-800">Canaan Homes LLC</h1>
          </div>

          <nav className="space-x-4 flex items-center">
            <a href="#home" className="text-gray-600 hover:text-blue-600">Home</a>
            <a href="#about" className="text-gray-600 hover:text-blue-600">About</a>
            <a href="#listings" className="text-gray-600 hover:text-blue-600">Listings</a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600">Contact</a>

            {user ? (
              <>
                <img
                  src={user.photo || '/default-avatar.png'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border cursor-pointer"
                  title={user.name}
                  onClick={() => navigate('/profile')}
                />
                <button
                  onClick={handleLogout}
                  className="ml-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="text-gray-600 hover:text-blue-600">Login</a>
                <a href="/signup" className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700">Sign Up</a>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="text-center py-32 text-white"
        data-aos="fade-up"
        style={{
          backgroundImage: "url('/bg-home.jpg')",
          backgroundSize: '110% 200%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-black bg-opacity-40 px-4 py-10">
          <h2 className="text-4xl font-bold mb-4 transition duration-500 hover:scale-105">
            Welcome to Canaan Homes LLC
          </h2>
          <p className="text-xl mb-6">Find your dream home.</p>
          <input
            type="text"
            placeholder="Search homes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md w-72 text-black"
          />
        </div>
      </section>

      {/* Featured Listings */}
      <section id="listings" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Listings</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredListings.length > 0 ? (
              filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  id={listing.id}
                  image={listing.image}
                  title={listing.title}
                  price={listing.price}
                  description={listing.description}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-600">No listings match your search.</p>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="relative py-20 bg-cover bg-center text-white"
        data-aos="fade-right"
        style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?real-estate,houses')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative max-w-5xl mx-auto px-4 text-center z-10">
          <h2 className="text-4xl font-bold mb-6">About Us</h2>
          <p className="text-lg mb-4">
            At Canaan Homes LLC, we've been helping people find their dream homes since 2020.
            We specialize in comfortable, affordable, and secure living spaces across Sharjah.
          </p>
          <p className="text-lg">
            Our mission is to make your home search seamless and satisfying — one key at a time. 🏠
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-100" data-aos="fade-up">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Contact Us</h2>
          <form className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700">Message</label>
              <textarea
                rows="4"
                placeholder="Your message"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Canaan Homes LLC. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-blue-400">Facebook</a>
            <a href="#" className="hover:text-blue-400">Instagram</a>
            <a href="#" className="hover:text-blue-400">LinkedIn</a>
          </div>
        </div>
      </footer>
    </>
  );
}
