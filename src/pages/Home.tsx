import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

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
      name: "Pizza",
    },
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
      name: "Burger",
    },
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
      name: "Rice",
    },
  },
];

const getFoodsFromResponse = (data: unknown): FoodItem[] => {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === "object") {
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
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await getAllFoods();
        const loadedFoods = getFoodsFromResponse(response.data);

        setFoods(
          loadedFoods.length > 0
            ? loadedFoods
            : fallbackFoods
        );
      } catch (error) {
        console.error("Failed to load foods:", error);
        setFoods(fallbackFoods);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const categories = useMemo(
    () => [
      "ALL",
      ...Array.from(
        new Set(
          foods
            .map((food) => food.category?.name)
            .filter(Boolean)
        )
      ),
    ],
    [foods]
  );

  const availableCount = foods.filter(
    (food) => food.status === "AVAILABLE"
  ).length;

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      category === "ALL" ||
      food.category?.name === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <section
        className="relative min-h-[520px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/65 to-gray-950/20"></div>

        <div className="relative mx-auto grid min-h-[520px] max-w-7xl items-center px-6 py-16">
          <div className="max-w-2xl text-white">
            <span className="mb-4 inline-flex rounded-md bg-amber-400 px-3 py-1 text-sm font-black text-gray-950">
              Fresh meals, fast checkout
            </span>

            <h1 className="text-5xl font-black leading-tight md:text-7xl">
              GourmetHub
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-gray-100 md:text-xl">
              Browse chef-prepared dishes, build your cart, and
              track every order from one clean food ordering system.
            </p>

            <div className="mt-8 grid max-w-lg grid-cols-3 overflow-hidden rounded-lg border border-white/20 bg-white/10 backdrop-blur">
              <div className="p-4">
                <p className="text-2xl font-black">
                  {foods.length}
                </p>
                <p className="text-xs font-semibold text-gray-200">
                  Menu Items
                </p>
              </div>

              <div className="border-x border-white/20 p-4">
                <p className="text-2xl font-black">
                  {categories.length - 1}
                </p>
                <p className="text-xs font-semibold text-gray-200">
                  Categories
                </p>
              </div>

              <div className="p-4">
                <p className="text-2xl font-black">
                  {availableCount}
                </p>
                <p className="text-xs font-semibold text-gray-200">
                  Available
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-amber-600">
              Explore Menu
            </p>
            <h2 className="mt-2 text-4xl font-black text-gray-950">
              Popular Foods
            </h2>
            <p className="mt-2 text-gray-600">
              Filter by category or search by dish name.
            </p>
          </div>

          <p className="rounded-md bg-white px-4 py-3 text-sm font-bold text-gray-600 shadow-sm">
            Showing {filteredFoods.length} of {foods.length}
          </p>
        </div>

        <div className="mb-10 grid gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_240px]">
          <label className="relative block">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search foods"
              className="h-12 w-full rounded-md border border-gray-300 pl-11 pr-4 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </label>

          <label className="relative block">
            <SlidersHorizontal
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="h-12 w-full rounded-md border border-gray-300 pl-11 pr-4 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "ALL" ? "All Categories" : item}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loading ? (
          <div className="rounded-lg border border-gray-200 bg-white py-16 text-center shadow-sm">
            <p className="text-lg font-semibold text-gray-700">
              Loading delicious food...
            </p>
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white py-16 text-center shadow-sm">
            <p className="text-lg font-semibold text-gray-500">
              No foods available.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
