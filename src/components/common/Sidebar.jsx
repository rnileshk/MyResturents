import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Utensils,
  CalendarCheck,
  ShoppingCart,
  CreditCard,
  Receipt,
  Truck,
  UserPlus,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = ({ role = "ADMIN" }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const adminLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Employees", path: "/admin/employees", icon: UserPlus },
    { name: "Menu", path: "/admin/menu", icon: Utensils },
    { name: "Bookings", path: "/admin/bookings", icon: CalendarCheck },
    { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
    { name: "Payments", path: "/admin/payments", icon: CreditCard },
    { name: "Bills", path: "/admin/bills", icon: Receipt },
    { name: "Deliveries", path: "/admin/deliveries", icon: Truck },
  ];

  const employeeLinks = [
    { name: "Dashboard", path: "/employee/dashboard", icon: LayoutDashboard },
    { name: "Orders", path: "/employee/orders", icon: ShoppingCart },
    { name: "Bookings", path: "/employee/bookings", icon: CalendarCheck },
    { name: "Billing", path: "/employee/billing", icon: Receipt },
  ];

  const deliveryLinks = [
    { name: "Dashboard", path: "/delivery/dashboard", icon: LayoutDashboard },
    { name: "Deliveries", path: "/delivery/list", icon: Truck },
  ];

  const billingLinks = [
    { name: "Dashboard", path: "/billing/dashboard", icon: LayoutDashboard },
    { name: "Bills", path: "/billing/list", icon: Receipt },
    { name: "Create Bill", path: "/billing/create", icon: CreditCard },
  ];

  let links = adminLinks;

  if (role === "EMPLOYEE") links = employeeLinks;
  if (role === "DELIVERY_STAFF") links = deliveryLinks;
  if (role === "BILLING_STAFF") links = billingLinks;

  const SidebarContent = ({ mobile = false }) => (
    <aside
      className={`relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white border-r border-white/10 shadow-2xl transition-all duration-300 ${
        isOpen || mobile ? "w-72" : "w-24"
      }`}
    >
      <div className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="absolute bottom-10 right-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative p-5">
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-orange-500 flex items-center justify-center font-black text-xl shadow-lg">
              R
            </div>

            {(isOpen || mobile) && (
              <div>
                <h2 className="text-2xl font-black text-white">Panel</h2>
                <p className="text-xs text-slate-400 uppercase tracking-wider">
                  {role.replace("_", " ")}
                </p>
              </div>
            )}
          </div>

          {mobile && (
            <button
              onClick={() => setMobileOpen(false)}
              className="h-10 w-10 rounded-xl bg-white/10 hover:bg-red-500 flex items-center justify-center transition"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {!mobile && (
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="absolute -right-4 top-8 h-9 w-9 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-xl border border-white/20 transition"
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        )}

        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => mobile && setMobileOpen(false)}
                title={!isOpen && !mobile ? link.name : ""}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  } ${!isOpen && !mobile ? "justify-center" : ""}`
                }
              >
                <Icon size={21} />

                {(isOpen || mobile) && (
                  <span className="font-semibold">{link.name}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {(isOpen || mobile) && (
          <div className="mt-8 rounded-3xl bg-white/10 border border-white/10 p-4">
            <p className="text-sm text-slate-300">Restaurant OS</p>
            <p className="text-lg font-black text-white mt-1">
              Control Deck
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Manage operations from one premium cockpit.
            </p>
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden h-11 w-11 rounded-2xl bg-slate-950 text-white flex items-center justify-center shadow-xl"
      >
        <Menu size={22} />
      </button>

      <div className="hidden md:block sticky top-0 h-screen">
        <SidebarContent />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/70"
          />

          <div className="relative z-10">
            <SidebarContent mobile />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;