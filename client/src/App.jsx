import './App.css';
import ListingCard from './ListingCard';

function App() {
  return (
    <>
      {/* Header / Navbar */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">🏢 Canaan Homes LLC</h1>
          <nav className="space-x-4">
            <a href="#" className="text-gray-600 hover:text-blue-600">Home</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">About</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Listings</a>
            <a href="#" className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-16 bg-gray-50">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Canaan Homes LLC
        </h2>
        <p className="text-xl text-gray-600 mb-6">Find your dream home.</p>
        <input
          type="text"
          placeholder="Search homes..."
          className="px-4 py-2 border border-gray-300 rounded-md w-72"
        />
      </section>

      {/* Featured Listings Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Featured Listings
          </h2>

          {/* single grid container – no nesting */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <ListingCard
              image="https://source.unsplash.com/400x300/?apartment"
              title="2BHK in Nairobi"
              price="KSh 35,000/month"
              description="Near Junction Mall, with modern amenities."
            />
            <ListingCard
              image="https://source.unsplash.com/400x300/?house"
              title="3BR in Westlands"
              price="KSh 80,000/month"
              description="Spacious house in a gated community."
            />
            <ListingCard
              image="https://source.unsplash.com/400x300/?rental,home"
              title="Studio in Kilimani"
              price="KSh 20,000/month"
              description="Compact and cozy, perfect for singles."
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default App;

