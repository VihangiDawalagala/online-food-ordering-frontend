import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";

import type { FoodItem } from "../types";
import { addToCart } from "../api/cartApi";
import { useAuth } from "../context/useAuth";

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
      await addToCart(user.id, food.id, 1);
      alert(`${food.name} added to cart`);
    } catch (error) {
      console.error(error);
      alert("Failed to add to cart");
    }
  };

  return (
    <article className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={food.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.src = fallbackImage;
          }}
        />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <span className="rounded-md bg-white/95 px-3 py-1 text-xs font-bold text-gray-800 shadow-sm">
            {food.category?.name ?? "Food"}
          </span>

          <span className="inline-flex items-center gap-1 rounded-md bg-gray-950/90 px-2.5 py-1 text-xs font-bold text-amber-300">
            <Star size={13} fill="currentColor" />
            4.8
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold text-gray-950">
            {food.name}
          </h3>

          <span
            className={`rounded-md px-2 py-1 text-xs font-bold ${
              food.status === "AVAILABLE"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {food.status === "AVAILABLE"
              ? "Available"
              : "Out"}
          </span>
        </div>

        <p className="mt-3 min-h-[48px] text-sm leading-6 text-gray-600">
          {food.description ||
            "Delicious food prepared by our chefs."}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-2xl font-black text-gray-950">
            Rs. {food.price.toLocaleString()}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-[1fr_44px] gap-3">
          <Link
            to={`/food/${food.id}`}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50"
          >
            View Details
          </Link>

          <button
            onClick={handleAddToCart}
            className="grid h-11 w-11 place-items-center rounded-md bg-amber-500 text-gray-950 hover:bg-amber-400"
            aria-label={`Add ${food.name} to cart`}
          >
            <ShoppingCart size={19} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default FoodCard;
