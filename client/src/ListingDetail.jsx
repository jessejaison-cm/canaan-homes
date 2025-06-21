// ListingDetail.jsx
import { useParams, Link } from 'react-router-dom';
import { listings } from './data';

function ListingDetail() {
  const { id } = useParams();
  const listing = listings.find((item) => item.id === id);

  if (!listing) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-3xl font-bold text-red-600">Listing not found</h2>
        <Link to="/" className="text-blue-600 underline">← Back to home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <img
        src={listing.image}
        alt={listing.title}
        className="w-full h-96 object-cover rounded-lg shadow-md mb-6"
      />
      <h2 className="text-4xl font-bold text-gray-800 mb-2">{listing.title}</h2>
      <p className="text-xl text-blue-600 mb-4">{listing.price}</p>
      <p className="text-gray-700 text-lg">{listing.fullDescription}</p>
      <Link
        to="/"
        className="inline-block mt-6 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
      >
        ← Back to Home
      </Link>
    </div>
  );
}

export default ListingDetail;
