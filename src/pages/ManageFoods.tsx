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

type ApiError = {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
    };
  };
};

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

const normalizeName = (name: string) =>
  name.trim().replace(/\s+/g, " ");

const normalizeKey = (name: string) =>
  normalizeName(name).toLowerCase();

const uniqueCategories = (items: Category[]) => {
  const seen = new Set<string>();

  return items.filter((category) => {
    const key = normalizeKey(category.name);

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

const uniqueFoods = (items: FoodItem[]) => {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = [
      normalizeKey(item.name),
      item.category?.id ?? "no-category",
    ].join("-");

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

const getSavedFoods = () => {
  try {
    const savedFoods = localStorage.getItem("localFoods");
    return savedFoods ? (JSON.parse(savedFoods) as FoodItem[]) : [];
  } catch {
    localStorage.removeItem("localFoods");
    return [];
  }
};

const saveLocalFoods = (items: FoodItem[]) => {
  localStorage.setItem("localFoods", JSON.stringify(items));
};

const getErrorMessage = (error: unknown) => {
  const apiError = error as ApiError;
  const status = apiError.response?.status;
  const message =
    apiError.response?.data?.message ||
    apiError.response?.data?.error;

  if (status === 401 || status === 403) {
    return "Backend rejected this request because this login token is not admin. Saved locally for the frontend demo.";
  }

  return message || "Backend failed. Saved locally for the frontend demo.";
};

const statusBadge = (status: FoodItem["status"]) =>
  status === "AVAILABLE"
    ? "status-success"
    : "status-danger";

function ManageFoods() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [food, setFood] = useState<FoodFormState>(initialFoodState);
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadFoods = async () => {
    try {
      const response = await getAllFoods();
      setFoods(uniqueFoods([...response.data, ...getSavedFoods()]));
    } catch (error) {
      console.error(error);
      setFoods(uniqueFoods(getSavedFoods()));
    }
  };

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      const cleanCategories = uniqueCategories(response.data);

      setCategories(cleanCategories);

      if (cleanCategories[0]) {
        setFood((current) => ({
          ...current,
          category: {
            id: cleanCategories[0].id,
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
    setFood({
      ...initialFoodState,
      category: {
        id: categories[0]?.id || 1,
      },
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    const selectedCategory = categories.find(
      (category) => category.id === food.category.id
    );
    const foodName = normalizeName(food.name);
    const price = Number(food.price);

    if (!foodName || !food.price) {
      alert("Food name and price are required");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      alert("Price must be greater than 0");
      return;
    }

    if (!selectedCategory) {
      alert("Please create a category before adding food");
      return;
    }

    const payload = {
      ...food,
      name: foodName,
      description: food.description?.trim(),
      imageUrl: food.imageUrl?.trim(),
      price,
      category: {
        id: selectedCategory.id,
      },
    };

    try {
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
      const localFood: FoodItem = {
        id: editingId || Date.now(),
        name: payload.name,
        description: payload.description,
        price: payload.price,
        imageUrl: payload.imageUrl,
        status: payload.status,
        category: selectedCategory,
      };
      const savedFoods = getSavedFoods();
      const nextSavedFoods = [
        ...savedFoods.filter((item) => item.id !== localFood.id),
        localFood,
      ];

      saveLocalFoods(nextSavedFoods);
      setFoods((current) => {
        const withoutOldItem = current.filter(
          (item) => item.id !== localFood.id
        );

        return uniqueFoods([...withoutOldItem, localFood]);
      });
      resetForm();
      alert(getErrorMessage(error));
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
      const nextSavedFoods = getSavedFoods().filter(
        (item) => item.id !== id
      );

      saveLocalFoods(nextSavedFoods);
      setFoods((current) =>
        current.filter((item) => item.id !== id)
      );
      alert(getErrorMessage(error));
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="page-header mb-6">
          <p className="section-kicker">
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
          <section className="surface p-6">
            <h2 className="flex items-center gap-2 text-xl font-black text-gray-950">
              <PackagePlus size={20} />
              {editingId ? "Edit Food" : "Add Food"}
            </h2>

            <div className="mt-5 space-y-4">
              <input
                className="field"
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
                  className="field"
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
                  className="field"
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
                className="field"
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
                className="field"
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
                className="field"
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
                className="btn-primary"
              >
                <PackagePlus size={18} />
                {editingId ? "Update" : "Add"}
              </button>

              {editingId && (
                <button
                  onClick={resetForm}
                  className="btn-muted"
                >
                  Cancel
                </button>
              )}
            </div>
          </section>

          <section className="surface overflow-hidden">
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
                    className="rounded-lg border border-gray-200 bg-slate-50/80 p-5"
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
                        className="btn-muted min-h-0 px-3 py-2"
                      >
                        <Edit3 size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(foodItem.id)
                        }
                        className="btn-danger min-h-0 px-3 py-2"
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
