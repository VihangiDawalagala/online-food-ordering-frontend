import { useEffect, useState } from "react";
import { getAllFoods } from "../api/foodApi";
import type { FoodItem } from "../types";
import FoodCard from "../components/FoodCard";

const fallbackFoods: FoodItem[] = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Classic pizza with tomato, mozzarella, and fresh basil.",
    price: 1850,
    imageUrl: "pizza.jpg",
    status: "AVAILABLE",
    category: {
      id: 1,
      name: "Pizza"
    }
  },
  {
    id: 2,
    name: "Cheese Burger",
    description: "Juicy grilled burger with cheese and crisp vegetables.",
    price: 1450,
    imageUrl: "burger.jpg",
    status: "AVAILABLE",
    category: {
      id: 2,
      name: "Burger"
    }
  },
  {
    id: 3,
    name: "Fried Rice",
    description: "Flavorful fried rice with vegetables and savory spices.",
    price: 1650,
    imageUrl: "friedrice.jpg",
    status: "AVAILABLE",
    category: {
      id: 3,
      name: "Rice"
    }
  }
];

const getFoodsFromResponse = (data: unknown): FoodItem[] => {
  if (Array.isArray(data)) {
    return data;
  }

  if (
    data &&
    typeof data === "object"
  ) {
    const responseData = data as {
      data?: unknown;
      content?: unknown;
      foods?: unknown;
      items?: unknown;
    };

    if (Array.isArray(responseData.data)) {
      return responseData.data;
    }

    if (Array.isArray(responseData.content)) {
      return responseData.content;
    }

    if (Array.isArray(responseData.foods)) {
      return responseData.foods;
    }

    if (Array.isArray(responseData.items)) {
      return responseData.items;
    }
  }

  return [];
};

function Home() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await getAllFoods();
      const loadedFoods = getFoodsFromResponse(response.data);

      console.log("Foods:", loadedFoods);

      setFoods(loadedFoods.length > 0 ? loadedFoods : fallbackFoods);
    } catch (error) {
      console.error("Failed to load foods:", error);
      setFoods(fallbackFoods);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* Hero Section */}
      <section
        className="h-[550px] bg-cover bg-center flex items-center justify-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative text-center text-white z-10">
          <h1 className="text-6xl md:text-7xl font-bold text-yellow-400 drop-shadow-lg">
            GourmetHub
          </h1>

          <p className="text-xl md:text-2xl mt-4">
            Premium Dining Experience Delivered
          </p>

          <button className="mt-8 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-xl transition">
            Explore Menu
          </button>
        </div>
      </section>

      {/* Popular Foods */}
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900">
            Popular Foods
          </h2>

          <p className="text-gray-500 mt-3 text-lg">
            Freshly prepared meals from our top chefs
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-xl font-semibold">
              Loading delicious food...
            </p>
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">
              No foods available.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {foods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
