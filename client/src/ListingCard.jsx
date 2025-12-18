import { Link } from 'react-router-dom';

function ListingCard({ id, image, title, price, description }) {
  return (
    <Link
      to={`/listing/${id}`}
      className="
        group relative block rounded-xl overflow-hidden
        bg-gradient-to-br from-gray-50 via-white to-gray-100
        shadow-md hover:shadow-2xl
        transition-all duration-500
        hover:-translate-y-1
      "
    >
      {/* Animated gradient overlay */}
      <div
        className="
          absolute inset-0 opacity-0 group-hover:opacity-100
          bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10
          transition-opacity duration-500
        "
      />

      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={image}
          alt={title}
          className="
            w-full h-48 object-cover
            transition-transform duration-500
            group-hover:scale-105
          "
        />
      </div>

      {/* Content */}
      <div className="relative p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {title}
        </h3>

        <p className="text-indigo-600 font-bold text-md">
          {price}
        </p>

        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  );
}

export default ListingCard;
