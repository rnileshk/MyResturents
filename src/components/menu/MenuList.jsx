import { useEffect, useState } from "react";
import { deleteMenuItem, getAllMenuItems } from "../../api/menuApi";
import MenuCard from "./MenuCard";
import MenuForm from "./MenuForm";

const MenuList = ({ adminMode = false, onAddToCart }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const data = await getAllMenuItems();
      setMenuItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuItems();
  }, []);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      await deleteMenuItem(id);
      loadMenuItems();
    } catch (error) {
      console.error(error);
      alert("Failed to delete menu item");
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedItem(null);
    loadMenuItems();
  };

  if (loading) {
    return <p className="text-center py-10">Loading menu...</p>;
  }

  return (
    <div className="space-y-6">
      {adminMode && (
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manage Menu</h1>

          <button
            onClick={() => {
              setSelectedItem(null);
              setShowForm(true);
            }}
            className="bg-black text-white px-5 py-3 rounded-lg"
          >
            Add Menu Item
          </button>
        </div>
      )}

      {showForm && adminMode && (
        <MenuForm
          selectedItem={selectedItem}
          onSuccess={handleSuccess}
          onCancel={() => {
            setShowForm(false);
            setSelectedItem(null);
          }}
        />
      )}

      {menuItems.length === 0 ? (
        <p className="text-center text-gray-500">No menu items found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              showActions={adminMode}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuList;