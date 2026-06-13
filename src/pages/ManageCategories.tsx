import { useEffect, useState } from "react";
import { Edit3, FolderPlus, Tags, Trash2 } from "lucide-react";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../api/categoryApi";
import type { Category } from "../types";

function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      await loadCategories();
    };

    fetchCategories();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.name) {
      alert("Category name is required");
      return;
    }

    try {
      if (editingId) {
        await updateCategory(editingId, form);
      } else {
        await createCategory(form);
      }

      resetForm();
      await loadCategories();
    } catch (error) {
      console.error(error);
      alert("Failed to save category");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="inline-flex items-center gap-2 text-sm font-black uppercase text-blue-700">
            <Tags size={16} />
            Menu Structure
          </p>
          <h1 className="mt-2 text-4xl font-black text-gray-950">
            Manage Categories
          </h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            Keep your menu easy to scan by grouping food items into
            clear categories.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-black text-gray-950">
              <FolderPlus size={20} />
              {editingId ? "Edit Category" : "Add Category"}
            </h2>

            <div className="mt-5 space-y-4">
              <input
                value={form.name}
                onChange={(event) =>
                  setForm({
                    ...form,
                    name: event.target.value,
                  })
                }
                placeholder="Category name"
                className="h-12 w-full rounded-md border border-gray-300 px-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm({
                    ...form,
                    description: event.target.value,
                  })
                }
                placeholder="Description"
                className="min-h-28 w-full resize-none rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
              >
                <FolderPlus size={18} />
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
                Categories
              </h2>
              <p className="text-sm text-gray-500">
                {categories.length} records
              </p>
            </div>

            <div className="divide-y divide-gray-200">
              {categories.length === 0 ? (
                <p className="p-6 text-gray-500">
                  No categories found.
                </p>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-black text-gray-950">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {category.description || "No description"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(category.id);
                          setForm({
                            name: category.name,
                            description:
                              category.description || "",
                          });
                        }}
                        className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100"
                      >
                        <Edit3 size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteCategory(category.id).then(loadCategories)
                        }
                        className="inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ManageCategories;
