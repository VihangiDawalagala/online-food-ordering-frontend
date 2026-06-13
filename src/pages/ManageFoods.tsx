import { useEffect, useState } from "react";
import {
  Edit3,
  Image,
  PackagePlus,
  Trash2,
  Utensils,
} from "lucide-react";

import { getCategories } from "../api/categoryApi";
import {
  createFood,
  deleteFood,
  getAllFoods,
  updateFood,
} from "../api/foodApi";
import type {
  Category,
  CreateFoodRequest,
  FoodItem,
} from "../types";

type FoodFormState = Omit<CreateFoodRequest, "price"> & {
  price: string;
};

const initialFoodState: FoodFormState = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  status: "AVAILABLE",
  category: {
    id: 1,
  },
};

const statusBadge = (status: FoodItem["status"]) =>
  status === "AVAILABLE"
    ? "bg-emerald-50 text-emerald-700"
    : "bg-red-50 text-red-700";

function ManageFoods() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [food, setFood] = useState<FoodFormState>(initialFoodState);
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadFoods = async () => {
    try {
      const response = await getAllFoods();
      setFoods(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);

      if (response.data[0]) {
        setFood((current) => ({
          ...current,
          category: {
            id: response.data[0].id,
          },
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        loadFoods(),
        loadCategories(),
      ]);
    };

    loadInitialData();
  }, []);

  const resetForm = () => {
    setFood(initialFoodState);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!food.name || !food.price) {
      alert("Food name and price are required");
      return;
    }

    try {
      const payload = {
        ...food,
        price: Number(food.price),
      };

      if (editingId) {
        await updateFood(editingId, payload);
        alert("Food Updated Successfully");
      } else {
        await createFood(payload);
        alert("Food Added Successfully");
      }

      resetForm();
      await loadFoods();
    } catch (error) {
      console.error(error);
      alert("Failed to save food");
    }
  };

  const handleEdit = (selectedFood: FoodItem) => {
    setEditingId(selectedFood.id);
    setFood({
      name: selectedFood.name,
      description: selectedFood.description || "",
      price: String(selectedFood.price),
      imageUrl: selectedFood.imageUrl || "",
      status: selectedFood.status,
      category: {
        id: selectedFood.category?.id || 1,
      },
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteFood(id);
      await loadFoods();
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="inline-flex items-center gap-2 text-sm font-black uppercase text-amber-700">
            <Utensils size={16} />
            Menu Operations
          </p>
          <h1 className="mt-2 text-4xl font-black text-gray-950">
            Manage Foods
          </h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            Add new dishes, update menu availability, and keep food
            pricing accurate.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-black text-gray-950">
              <PackagePlus size={20} />
              {editingId ? "Edit Food" : "Add Food"}
            </h2>

            <div className="mt-5 space-y-4">
              <input
                className="h-12 w-full rounded-md border border-gray-300 px-4 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                placeholder="Food Name"
                value={food.name}
                onChange={(event) =>
                  setFood({
                    ...food,
                    name: event.target.value,
                  })
                }
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  className="h-12 w-full rounded-md border border-gray-300 px-4 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  placeholder="Price"
                  type="number"
                  value={food.price}
                  onChange={(event) =>
                    setFood({
                      ...food,
                      price: event.target.value,
                    })
                  }
                />

                <select
                  className="h-12 w-full rounded-md border border-gray-300 px-4 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  value={food.status}
                  onChange={(event) =>
                    setFood({
                      ...food,
                      status: event.target.value as
                        | "AVAILABLE"
                        | "OUT_OF_STOCK",
                    })
                  }
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
              </div>

              <select
                className="h-12 w-full rounded-md border border-gray-300 px-4 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                value={food.category.id}
                onChange={(event) =>
                  setFood({
                    ...food,
                    category: {
                      id: Number(event.target.value),
                    },
                  })
                }
              >
                {categories.length === 0 ? (
                  <option value={1}>Default Category</option>
                ) : (
                  categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))
                )}
              </select>

              <input
                className="h-12 w-full rounded-md border border-gray-300 px-4 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                placeholder="Image URL"
                value={food.imageUrl}
                onChange={(event) =>
                  setFood({
                    ...food,
                    imageUrl: event.target.value,
                  })
                }
              />

              <textarea
                className="min-h-28 w-full resize-none rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                placeholder="Description"
                value={food.description}
                onChange={(event) =>
                  setFood({
                    ...food,
                    description: event.target.value,
                  })
                }
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-5 py-3 font-bold text-gray-950 hover:bg-amber-400"
              >
                <PackagePlus size={18} />
                {editingId ? "Update" : "Add"}
              </button>

              {editingId && (
                <button
                  onClick={resetForm}
                  className="rounded-md border border-gray-300 px-5 py-3 font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-5">
              <h2 className="text-xl font-black text-gray-950">
                Menu Items
              </h2>
              <p className="text-sm text-gray-500">
                {foods.length} records
              </p>
            </div>

            <div className="grid gap-4 p-5 lg:grid-cols-2">
              {foods.length === 0 ? (
                <p className="text-gray-500">No foods found.</p>
              ) : (
                foods.map((foodItem) => (
                  <article
                    key={foodItem.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-5"
                  >
                    <div className="flex gap-4">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-md bg-white text-amber-700">
                        <Image size={22} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <h3 className="text-xl font-black text-gray-950">
                            {foodItem.name}
                          </h3>

                          <span
                            className={`rounded-md px-3 py-1 text-xs font-bold ${statusBadge(foodItem.status)}`}
                          >
                            {foodItem.status === "AVAILABLE"
                              ? "Available"
                              : "Out of Stock"}
                          </span>
                        </div>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                          {foodItem.description || "No description"}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <span className="font-black text-gray-950">
                            Rs. {foodItem.price.toLocaleString()}
                          </span>
                          <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-gray-600">
                            {foodItem.category?.name || "Category"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() =>
                          handleEdit(foodItem)
                        }
                        className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100"
                      >
                        <Edit3 size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(foodItem.id)
                        }
                        className="inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ManageFoods;
