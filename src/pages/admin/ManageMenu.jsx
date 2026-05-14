import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  image: "",
  imageUrl: "",
  available: true,
  category: "",
};

const ManageMenu = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const normalizeList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const getImage = (item) => {
    return item.image || item.imageUrl || "";
  };

  const loadMenu = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosInstance.get("/api/menu");
      setItems(normalizeList(res.data));
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load menu."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const categories = [
    "ALL",
    ...Array.from(
      new Set(
        items
          .map((item) => item.category)
          .filter(Boolean)
      )
    ),
  ];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchText.toLowerCase());

    const matchesCategory =
      filterCategory === "ALL" || item.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setShowForm(true);
    setError("");
    setSuccess("");

    setFormData({
      name: item.name || "",
      description: item.description || "",
      price: item.price ?? "",
      image: item.image || item.imageUrl || "",
      imageUrl: item.imageUrl || item.image || "",
      available: item.available ?? true,
      category: item.category || "",
    });
  };

  const buildPayload = () => ({
    name: formData.name,
    description: formData.description,
    price: Number(formData.price),
    image: formData.image || formData.imageUrl,
    imageUrl: formData.imageUrl || formData.image,
    available: formData.available,
    category: formData.category,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = buildPayload();

      if (editingId) {
        await axiosInstance.put(`/api/menu/${editingId}`, payload);
        setSuccess("Menu item updated successfully.");
      } else {
        await axiosInstance.post("/api/menu", payload);
        setSuccess("Menu item added successfully.");
      }

      resetForm();
      await loadMenu();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to save menu item."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this menu item?")) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await axiosInstance.delete(`/api/menu/${id}`);

      setItems((prev) => prev.filter((item) => item.id !== id));
      setSuccess("Menu item deleted successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete menu item."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleAvailable = async (item) => {
    try {
      setError("");
      setSuccess("");

      const payload = {
        ...item,
        image: item.image || item.imageUrl,
        imageUrl: item.imageUrl || item.image,
        available: !item.available,
      };

      await axiosInstance.put(`/api/menu/${item.id}`, payload);

      setItems((prev) =>
        prev.map((menuItem) =>
          menuItem.id === item.id
            ? { ...menuItem, available: !menuItem.available }
            : menuItem
        )
      );

      setSuccess("Availability updated.");
    } catch (err) {
      console.error(err);
      setError("Failed to update availability.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-white/10 border border-white/10 shadow-2xl p-6 md:p-8">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-orange-300 font-semibold uppercase text-sm tracking-wide">
                Restaurant Menu Studio
              </p>

              <h1 className="text-4xl md:text-5xl font-black text-white mt-2">
                Manage Menu
              </h1>

              <p className="text-slate-300 mt-3 max-w-2xl">
                Create, update, search, filter, publish and remove food items
                from your premium restaurant menu.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={loadMenu}
                className="bg-white text-slate-900 px-5 py-3 rounded-2xl font-bold hover:bg-orange-100 transition shadow-lg"
              >
                Refresh
              </button>

              <button
                onClick={openCreateForm}
                className="bg-orange-500 text-white px-5 py-3 rounded-2xl font-bold hover:bg-orange-600 transition shadow-lg"
              >
                Add Menu Item
              </button>
            </div>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl shadow-xl p-5">
            <p className="text-slate-500 font-semibold">Total Items</p>
            <h2 className="text-4xl font-black text-slate-900 mt-2">
              {items.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-5">
            <p className="text-slate-500 font-semibold">Available</p>
            <h2 className="text-4xl font-black text-emerald-600 mt-2">
              {items.filter((item) => item.available).length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-5">
            <p className="text-slate-500 font-semibold">Unavailable</p>
            <h2 className="text-4xl font-black text-red-600 mt-2">
              {items.filter((item) => !item.available).length}
            </h2>
          </div>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="md:col-span-2 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {editingId ? "Update Menu Item" : "Create Menu Item"}
                </h2>
                <p className="text-slate-500">
                  Add polished details for your food item.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="text-slate-500 hover:text-red-600 font-bold"
              >
                Close
              </button>
            </div>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Item name"
              className="border border-slate-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />

            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="border border-slate-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="border border-slate-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />

            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="border border-slate-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="border border-slate-300 p-3 rounded-2xl md:col-span-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows="4"
            />

            <label className="flex items-center gap-3 bg-slate-100 p-3 rounded-2xl">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
              />
              <span className="font-semibold text-slate-700">
                Available for customers
              </span>
            </label>

            {formData.image && (
              <div className="bg-slate-100 rounded-2xl p-3">
                <p className="text-sm font-bold text-slate-600 mb-2">
                  Image Preview
                </p>
                <img
                  src={formData.image}
                  alt="Preview"
                  className="h-24 w-full object-cover rounded-xl"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="md:col-span-2 bg-slate-950 text-white px-5 py-3 rounded-2xl font-bold hover:bg-orange-600 transition disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Menu Item"
                : "Create Menu Item"}
            </button>
          </form>
        )}

        <div className="bg-white rounded-3xl shadow-2xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Menu Collection
              </h2>
              <p className="text-slate-500">
                Showing {filteredItems.length} of {items.length} items
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search menu..."
                className="border border-slate-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-slate-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No menu items found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-3xl bg-slate-50 border border-slate-200 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-52 bg-slate-200">
                    {getImage(item) ? (
                      <img
                        src={getImage(item)}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 font-bold">
                        No Image
                      </div>
                    )}

                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-black/70 text-white text-sm font-bold">
                        {item.category || "General"}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleAvailable(item)}
                      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-bold ${
                        item.available
                          ? "bg-emerald-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {item.available ? "Available" : "Unavailable"}
                    </button>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-2xl font-black text-slate-900">
                        {item.name}
                      </h2>

                      <p className="text-xl font-black text-orange-600">
                        ₹ {item.price}
                      </p>
                    </div>

                    <p className="text-slate-600 line-clamp-2 min-h-[48px]">
                      {item.description || "No description added."}
                    </p>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 bg-blue-600 text-white px-3 py-3 rounded-2xl font-bold hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="flex-1 bg-red-600 text-white px-3 py-3 rounded-2xl font-bold hover:bg-red-700 transition disabled:opacity-60"
                      >
                        {deletingId === item.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageMenu;