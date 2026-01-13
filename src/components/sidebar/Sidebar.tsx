import { NavLink, Link } from "react-router-dom";
import { CirclesFourIcon, GearIcon, LinkSimpleIcon, UserIcon, WalletIcon } from "@phosphor-icons/react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  user: {
    fullname?: string;
    email?: string;
  } | null;
}

const Sidebar = ({ isOpen, onClose, pathname, user }: SidebarProps) => {
  const menuItems = [
    { name: "Dashboard", path: "/account", icon: <CirclesFourIcon /> },
    { name: "Payment methods", path: "/account/payment-methods", icon: <WalletIcon /> },
    { name: "Payment links", path: "/account/payment-links", icon: <LinkSimpleIcon /> },
    { name: "Settings", path: "/account/settings", icon: <GearIcon /> },
    { name: "Profile", path: "/account/profile", icon: <UserIcon /> },
  ];

  return (
    <aside
      className={`fixed lg:static md:bg-none bg-gray-50 p-2 inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="flex flex-col h-full bg-white border border-gray-500/[0.1] rounded-lg">
        {/* Logo */}
        <div className="flex items-center justify-between p-4">
          <Link to="/">
            <img src="/logo.svg" alt="Logo" className="h-8 w-16" />
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/account"}
                  onClick={onClose}
                  className={() =>
                    `flex items-center gap-3 px-3 py-3 text-[14px] rounded-lg font-medium transition-colors ${
                      pathname === item.path
                        ? "bg-gray-50 opacity-100 border border-gray-500/[0.1]"
                        : "opacity-[0.5] hover:bg-gray-100"
                    }`
                  }
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="leading-0">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile in Sidebar */}
        <div className="p-4 border-t border-gray-200">
            <Link to="/account/profile" onClick={onClose}
                className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
                <img src="/profile.jpg" alt="Profile" className="w-10 h-10 rounded-full shadow border border-white outline outline-primary/[0.2] outline-offset-2" />
                <div className="text-start font-medium text-gray-700">
                    <p>{user?.fullname || user?.email?.split("@")[0]}</p>
                    <p className="text-[10px]">{user?.email}</p>
                </div>
            </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
