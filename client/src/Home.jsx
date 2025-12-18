import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { listings } from './data';

import ListingCard from './ListingCard';

export default function Home() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredListings, setFilteredListings] = useState(listings);
  const navigate = useNavigate();
  const listingsRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => data?.name && setUser(data))
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredListings(
      listings.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.price.toLowerCase().includes(q)
      )
    );
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">

      {/* ===== Animated Background ===== */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-3xl animate-[float1_20s_ease-in-out_infinite]" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-emerald-500/30 rounded-full blur-3xl animate-[float2_26s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-25%] left-[30%] w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-3xl animate-[float3_18s_ease-in-out_infinite]" />

      {/* ===== NAVBAR ===== */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-gray-800">
          <div className="flex items-center gap-3">
            <img src="/bg-home.jpg" className="w-10 h-10 rounded-full object-cover" />
            <span className="text-xl font-extrabold tracking-tight">
              Canaan Homes
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium">
            {['Home', 'Listings', 'About', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative group"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <img
                  src={user.photo || '/default-avatar.png'}
                  className="w-8 h-8 rounded-full border cursor-pointer"
                  onClick={() => navigate('/profile')}
                />
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="hover:text-blue-600">Login</a>
                <a
                  href="/signup"
                  className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ===== HERO with sticky search ===== */}
      <section
        id="home"
        className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] pt-24 text-center"
        data-aos="fade-up"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          Find Your Dream Home
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          Premium properties • Trusted agents • Seamless experience
        </p>

        {/* Sticky search bar */}
        <div className="w-full flex justify-center sticky top-24 z-20">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-6 py-3 w-80 rounded-xl text-black shadow-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </section>

      {/* ===== LISTINGS ===== */}
      <section
        id="listings"
        ref={listingsRef}
        className="relative z-10 pt-6 pb-20"
        data-aos="fade-up"
      >
        <h2 className="text-4xl font-bold text-center mb-10">
          Featured Listings
        </h2>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {filteredListings.length ? (
            filteredListings.map((listing) => (
              <div data-aos="zoom-in" key={listing.id}>
                <ListingCard {...listing} />
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400">
              No listings found
            </p>
          )}
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section
        id="about"
        className="relative z-10 py-28 bg-white/5 backdrop-blur-xl"
        data-aos="fade-right"
      >
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            About Canaan Homes
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            We specialize in high-quality residential properties across Sharjah.
            Our mission is to make home-finding elegant, transparent, and stress-free.
          </p>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section
        id="contact"
        className="relative z-10 py-28"
        data-aos="fade-left"
      >
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-10">
            Contact Us
          </h2>

          <form className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-5 text-gray-800">
            <input className="w-full px-4 py-2 border rounded-lg" placeholder="Name" />
            <input className="w-full px-4 py-2 border rounded-lg" placeholder="Email" />
            <textarea rows="4" className="w-full px-4 py-2 border rounded-lg" placeholder="Message" />
            <button className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 py-6 text-center text-gray-400">
        © {new Date().getFullYear()} Canaan Homes LLC. All rights reserved.
      </footer>

      {/* ===== ANIMATIONS ===== */}
      <style>
        {`
          @keyframes float1 {
            0%,100% { transform: translate(0,0); }
            50% { transform: translate(80px,60px); }
          }
          @keyframes float2 {
            0%,100% { transform: translate(0,0); }
            50% { transform: translate(-100px,-80px); }
          }
          @keyframes float3 {
            0%,100% { transform: translate(0,0); }
            50% { transform: translate(60px,-100px); }
          }
        `}
      </style>
    </div>
  );
}
