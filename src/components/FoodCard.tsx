import { Link } from "react-router-dom";
import type { FoodItem } from "../types";
import { addToCart } from "../api/cartApi";
import { useAuth } from "../context/AuthContext";

interface Props {
  food: FoodItem;
}

const backendImageUrl = "http://localhost:8080/images";
const fallbackImage =
  "https://images.unsplash.com/photo-1513104890138-7c749659a591";

const getImageUrl = (imageUrl?: string) => {
  const value = imageUrl?.trim();

  if (!value) {
    return fallbackImage;
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  if (value.startsWith("/images/")) {
    return `http://localhost:8080${value}`;
  }

  const fileName = value
    .split(/[\\/]/)
    .filter(Boolean)
    .pop();

  return `${backendImageUrl}/${fileName ?? value}`;
};

function FoodCard({ food }: Props) {
  const { user } = useAuth();

  const image = getImageUrl(food.imageUrl);

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      await addToCart(
        user.id,
        food.id,
        1
      );

      alert(`${food.name} added to cart`);
    } catch (error) {
      console.error(error);
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">

      <div className="relative">
        <img
          src={image}
          alt={food.name}
          className="w-full h-60 object-cover"
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />

        <span className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
          {food.category?.name ?? "Food"}
        </span>

        <span className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-bold shadow">
          ⭐ 4.8
        </span>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900">
          {food.name}
        </h3>

        <p className="text-gray-500 mt-2 min-h-[50px]">
          {food.description || "Delicious food prepared by our chefs."}
        </p>

        <div className="flex justify-between items-center mt-6">
          <span className="text-3xl font-bold text-yellow-600">
            Rs. {food.price.toLocaleString()}
          </span>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-yellow-500 text-black px-4 py-3 rounded-xl font-semibold hover:bg-yellow-600"
          >
            Add To Cart
          </button>

          <Link
            to={`/food/${food.id}`}
            className="flex-1 text-center bg-black text-white px-4 py-3 rounded-xl font-semibold hover:bg-gray-800"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
