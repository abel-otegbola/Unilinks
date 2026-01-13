import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Dashboard from "./dashboard";
import { GearIcon, ListIcon, SignOutIcon, UserIcon } from "@phosphor-icons/react";
import Sidebar from "../../components/sidebar/Sidebar";
import PaymentMethodsPage from "./payment-methods";
import PaymentLinks from "./links";
import SingleLinkPage from "./singleLink";
import ProfilePage from "./profile";

function AccountLayout() {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) {
    navigate("/auth/login");
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/[0.50] z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        pathname={pathname}
        user={user}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-10">
          <div className="flex items-center justify-between px-2 pl-5 py-2">
            <p className="lg:block hidden font-semibold text-lg capitalize">{pathname.split("/")[1] ||pathname.split("/")[0] }</p>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden"
            >
              <ListIcon size={24} />
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-2 transition-colors"
              >
                <img src="/profile.jpg" alt="Profile" className="w-10 h-10 rounded-full shadow border border-white outline outline-primary/[0.2] outline-offset-2" />
                <div className="hidden sm:block text-start font-medium text-gray-700">
                  <p>{user?.displayName || "User"}</p>
                  <p className="text-[10px]">{user?.email}</p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate("/account/settings");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <span><GearIcon size={16} /></span>
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate("/account/profile");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <span><UserIcon size={16} /></span>
                    Profile
                  </button>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <span><SignOutIcon size={16} /></span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-white rounded-lg md:border border-gray-500/[0.1] p-4 md:mr-2 md:mb-2">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/payment-methods" element={<PaymentMethodsPage />} />
            <Route path="/payment-links" element={<PaymentLinks />} />
            <Route path="/payment-links/:id" element={<SingleLinkPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Add more routes as needed */}
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default AccountLayout;
