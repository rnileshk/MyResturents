import { useEffect, useState } from "react";
import { createMenuItem, updateMenuItem } from "../../api/menuApi";

const MenuForm = ({ selectedItem, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    available: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        name: selectedItem.name || "",
        description: selectedItem.description || "",
        price: selectedItem.price || "",
        category: selectedItem.category || "",
        imageUrl: selectedItem.imageUrl || "",
        available: selectedItem.available ?? true,
      });
    }
  }, [selectedItem]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: Number(formData.price),
    };

    try {
      setLoading(true);

      if (selectedItem?.id) {
        await updateMenuItem(selectedItem.id, payload);
      } else {
        await createMenuItem(payload);
      }

      onSuccess?.();
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        imageUrl: "",
        available: true,
      });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save menu item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-bold">
        {selectedItem ? "Update Menu Item" : "Add Menu Item"}
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Food name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full border p-3 rounded-lg"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        required
        min="1"
        className="w-full border p-3 rounded-lg"
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
      />

      <input
        type="text"
        name="imageUrl"
        placeholder="Image URL"
        value={formData.imageUrl}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="available"
          checked={formData.available}
          onChange={handleChange}
        />
        Available
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-5 py-3 rounded-lg disabled:opacity-60"
        >
          {loading ? "Saving..." : selectedItem ? "Update" : "Create"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 px-5 py-3 rounded-lg"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default MenuForm;