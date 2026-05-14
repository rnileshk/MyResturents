const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 className="text-2xl font-bold text-orange-500">Restaurant</h2>
          <p className="text-gray-400 mt-2">
            Delicious food, easy table booking, fast delivery, and smooth billing.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-gray-400">
            <li>Home</li>
            <li>Menu</li>
            <li>Book Table</li>
            <li>Orders</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <p className="text-gray-400">Email: support@restaurant.com</p>
          <p className="text-gray-400">Phone: +91 9876543210</p>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center py-4 text-gray-500">
        © {new Date().getFullYear()} Restaurant Management System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;