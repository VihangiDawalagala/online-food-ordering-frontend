import { useEffect, useState } from "react";
import {
  getAllFoods,
  createFood,
  deleteFood
} from "../api/foodApi";
import type {
  CreateFoodRequest,
  FoodItem
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
    id: 1
  }
};

function ManageFoods() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [food, setFood] = useState<FoodFormState>(initialFoodState);

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    try {
      const response = await getAllFoods();
      setFoods(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async () => {
    try {
      await createFood({
        ...food,
        price: Number(food.price)
      });

      alert("Food Added Successfully");

      setFood(initialFoodState);

      loadFoods();
    } catch (error) {
      console.error(error);
      alert("Failed to add food");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteFood(id);
      loadFoods();
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Manage Foods
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-lg mb-10">

          <h2 className="text-2xl font-bold mb-4">
            Add New Food
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              className="border p-3 rounded"
              placeholder="Food Name"
              value={food.name}
              onChange={(e) =>
                setFood({
                  ...food,
                  name: e.target.value
                })
              }
            />

            <input
              className="border p-3 rounded"
              placeholder="Price"
              value={food.price}
              onChange={(e) =>
                setFood({
                  ...food,
                  price: e.target.value
                })
              }
            />

            <input
              className="border p-3 rounded"
              placeholder="Image URL"
              value={food.imageUrl}
              onChange={(e) =>
                setFood({
                  ...food,
                  imageUrl: e.target.value
                })
              }
            />

            <input
              className="border p-3 rounded"
              placeholder="Description"
              value={food.description}
              onChange={(e) =>
                setFood({
                  ...food,
                  description: e.target.value
                })
              }
            />
          </div>

          <button
            onClick={handleCreate}
            className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            Add Food
          </button>

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {foods.map((food) => (
            <div
              key={food.id}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-2xl font-bold">
                {food.name}
              </h2>

              <p className="text-gray-500">
                {food.description}
              </p>

              <p className="font-bold mt-3">
                Rs. {food.price}
              </p>

              <button
                onClick={() =>
                  handleDelete(food.id)
                }
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default ManageFoods;
