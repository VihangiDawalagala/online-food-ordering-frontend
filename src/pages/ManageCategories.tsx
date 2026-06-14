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
    <div className="page-shell">
      <div className="page-container-narrow">
        <div className="page-header mb-6">
          <p className="section-kicker">
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
          <section className="surface p-6">
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
                className="field"
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
                className="field"
              />
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={handleSubmit}
                className="btn-primary"
              >
                <FolderPlus size={18} />
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
                        className="btn-muted min-h-0 px-3 py-2"
                      >
                        <Edit3 size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteCategory(category.id).then(loadCategories)
                        }
                        className="btn-danger min-h-0 px-3 py-2"
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
