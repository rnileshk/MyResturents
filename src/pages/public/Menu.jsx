import { useEffect, useState } from "react";
import { getAllMenuItems } from "../../api/menuApi";
import MenuCard from "../../components/menu/MenuCard";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const normalizeList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllMenuItems();
        const list = normalizeList(data);

        setMenuItems(list);
      } catch (err) {
        console.error(err);
        setError("Unable to load menu items.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Our Menu</h1>
        <p className="text-gray-600 mt-2">
          Explore fresh and delicious food items.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      {menuItems.length === 0 && !error ? (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
          No menu items available.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;