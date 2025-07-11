import { Link } from 'react-router-dom';

function ListingCard({ id, image, title, price, description }) {
  return (
    <Link to={`/listing/${id}`} className="block bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition duration-300">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-700">{price}</p>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
      </div>
    </Link>
  );
}

export default ListingCard;

