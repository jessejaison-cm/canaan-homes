// ListingCard.jsx
import { Link } from 'react-router-dom';

function ListingCard({ id, image, title, price, description }) {
  return (
    <Link to={`/listing/${id}`}>
      <div className="border rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <p className="text-blue-600">{price}</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export default ListingCard;
