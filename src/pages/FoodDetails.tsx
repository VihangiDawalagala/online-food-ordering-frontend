import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { addToCart } from "../api/cartApi";
import { getFoodById } from "../api/foodApi";
import type { FoodItem } from "../types";
import { useAuth } from "../context/useAuth";

const fallbackImages = {
  default:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
  pizza:
    "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  burger:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  rice:
    "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
};

const getFallbackImage = (food: FoodItem) => {
  const value = `${food.name} ${food.category?.name ?? ""}`.toLowerCase();

  if (value.includes("burger")) {
    return fallbackImages.burger;
  }

  if (value.includes("rice")) {
    return fallbackImages.rice;
  }

  if (value.includes("pizza")) {
    return fallbackImages.pizza;
  }

  return fallbackImages.default;
};

const getImageUrl = (food: FoodItem) => {
  const value = food.imageUrl?.trim();

  if (!value) {
    return getFallbackImage(food);
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
      <div className="page-shell">
        <p className="text-center font-semibold">Loading food...</p>
      </div>
    );
  }

  if (error || !food) {
    return (
      <div className="page-shell">
        <p className="text-center text-red-600">
          {error || "Food not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="surface mx-auto max-w-5xl overflow-hidden">
        <img
          src={getImageUrl(food)}
          alt={food.name}
          className="w-full h-96 object-cover"
          onError={(event) => {
            event.currentTarget.src = getFallbackImage(food);
          }}
        />

        <div className="p-8">
          <span className="status-neutral mb-4 inline-block rounded-md px-4 py-2 font-semibold">
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
            className="btn-primary mt-6"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodDetails;
