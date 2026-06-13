import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { addToCart } from "../api/cartApi";
import { getFoodById } from "../api/foodApi";
import type { FoodItem } from "../types";
import { useAuth } from "../context/useAuth";

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

  return `http://localhost:8080/images/${value}`;
};

function FoodDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [food, setFood] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFood = async () => {
      const foodId = Number(id);

      if (!foodId) {
        setError("Invalid food item");
        setLoading(false);
        return;
      }

      try {
        const response = await getFoodById(foodId);
        setFood(response.data);
      } catch {
        setError("Food item could not be loaded");
      } finally {
        setLoading(false);
      }
    };

    loadFood();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    if (!food) {
      return;
    }

    try {
      await addToCart(user.id, food.id, 1);
      alert(`${food.name} added to cart`);
    } catch (cartError) {
      console.error(cartError);
      alert("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <p className="text-center font-semibold">Loading food...</p>
      </div>
    );
  }

  if (error || !food) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <p className="text-center text-red-600">
          {error || "Food not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <img
          src={getImageUrl(food.imageUrl)}
          alt={food.name}
          className="w-full h-96 object-cover"
          onError={(event) => {
            event.currentTarget.src = fallbackImage;
          }}
        />

        <div className="p-8">
          <span className="mb-4 inline-block rounded-md bg-amber-100 px-4 py-2 font-semibold text-amber-800">
            {food.category?.name ?? "Food"}
          </span>

          <h1 className="text-4xl font-black text-gray-950">
            {food.name}
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-gray-600">
            {food.description ||
              "Delicious food prepared by our chefs."}
          </p>

          <p className="mt-6 text-3xl font-black text-gray-950">
            Rs. {food.price.toLocaleString()}
          </p>

          <button
            onClick={handleAddToCart}
            className="mt-6 rounded-md bg-amber-500 px-6 py-3 font-bold text-gray-950 hover:bg-amber-400"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodDetails;
