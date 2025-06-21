import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import './App.css';
import ListingCard from './ListingCard';

export default function Home() {
  // initialise AOS once
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

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
    
    <nav className="space-x-4">
      <a href="#home" className="text-gray-600 hover:text-blue-600">Home</a>
      <a href="#about" className="text-gray-600 hover:text-blue-600">About</a>
      <a href="#listings" className="text-gray-600 hover:text-blue-600">Listings</a>
      <a href="#contact" className="text-gray-600 hover:text-blue-600">Contact</a>
      <a href="/login" className="text-gray-600 hover:text-blue-600">Login</a>
      <a href="/signup" className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700">Sign Up</a>
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
            className="px-4 py-2 border border-gray-300 rounded-md w-72 text-black"
          />
        </div>
      </section>

      {/* Featured Listings */}
      <section id="listings" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Listings</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <ListingCard
              id="1"
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj5k5vBGnZWxOsrAECLllBigzDVlaofyXtqg&s"
              title="2BHK in Nairobi"
              price="AED 3500/month"
              description="Near Junction Mall, with modern amenities."
            />
            <ListingCard
              id="2"
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXeBLqva86IV7xWRLzK5KlavN8eqHO5D_y4Q&s"
              title="3BHK in Sharjah"
              price="AED 4000/month"
              description="Spacious house in a gated community."
            />
            <ListingCard
              id="3"
              image="https://homedecorlite.com/public/uploads/20240722/d255ea7b9f817f2a08051ce50ad8c8fb.jpg"
              title="2BHK in Sharjah"
              price="AED 2000/month"
              description="Compact and cozy, perfect for singles."
            />
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
            At Canaan Homes LLC, we’ve been helping people find their dream homes since 2020.
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
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Contact Us</h2>
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
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Canaan Homes LLC. All rights reserved.
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
