import { NavLink, Outlet } from "react-router-dom";
import { Users, Package, ShoppingCart, LayoutDashboard } from "lucide-react";

function Dashboard() {
  const navLinks = [
    { name: "Statistics", to: "/dashboard/stats", icon: LayoutDashboard },
    { name: "Users", to: "/dashboard/users", icon: Users },
    { name: "Products", to: "/dashboard/products", icon: Package },
    { name: "Orders", to: "/dashboard/orders", icon: ShoppingCart },
  ];

  return (
    <div className="main-container min-h-screen p-0">
      <div className="grid grid-cols-[210px_1fr] min-h-screen">
        <aside
          className="
            w-auto bg-secondary border-r-2 border-bg-secondary-dark dark:border-bg-secondary"
        >
          <div className="p-6 flex flex-col items-start gap-6 h-full">
            <div className="w-full">
              <h4 className="sub-text">Admin Panel</h4>
            </div>
            <nav className="flex flex-col items-start w-full gap-2">
              {navLinks.map((item, index) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    to={item.to}
                    key={index}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 ${
                        isActive
                          ? "bg-btn dark:bg-btn-dark text-white font-semibold shadow-md"
                          : "text-text-color dark:text-text-color-dark hover:bg-hover dark:hover:bg-hover-dark"
                      }`
                    }
                  >
                    <Icon size={20} />
                    <span className="text-sm sm:text-base">{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="background p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
