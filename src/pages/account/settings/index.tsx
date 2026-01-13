import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import Toggle from "../../../components/toggle/toggle";
import Dropdown from "../../../components/dropdown/dropdown";
import { SettingItem, SettingItemWithButton } from "../../../components/settingItem/SettingItem";
import ChangePasswordModal from "../../../components/modal/ChangePasswordModal";
import { LockIcon, BellIcon, PaletteIcon, GlobeIcon, ShieldCheckIcon } from "@phosphor-icons/react";
import { useLocalStorage } from "../../../customHooks/useLocaStorage";

const currencies = [
  { id: "USD", title: "USD - US Dollar" },
  { id: "EUR", title: "EUR - Euro" },
  { id: "GBP", title: "GBP - British Pound" },
  { id: "NGN", title: "NGN - Nigerian Naira" },
  { id: "KES", title: "KES - Kenyan Shilling" },
  { id: "ZAR", title: "ZAR - South African Rand" },
];

const themes = [
  { id: "light", title: "Light Mode" },
  { id: "dark", title: "Dark Mode" },
  { id: "system", title: "System Default" },
];

function SettingsPage() {
  const { user } = useContext(AuthContext);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  // Settings state
  const [emailNotifications, setEmailNotifications] = useLocalStorage("emailNotifications", true);
  const [paymentNotifications, setPaymentNotifications] = useLocalStorage("paymentNotifications", true);
  const [linkExpiryNotifications, setLinkExpiryNotifications] = useLocalStorage("linkExpiryNotifications", true);
  const [defaultCurrency, setDefaultCurrency] = useLocalStorage("defaultCurrency", "USD");
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [twoFactorAuth, setTwoFactorAuth] = useLocalStorage("twoFactorAuth", false);
  const [sessionTimeout, setSessionTimeout] = useLocalStorage("sessionTimeout", "30");

  const sessionTimeouts = [
    { id: "15", title: "15 minutes" },
    { id: "30", title: "30 minutes" },
    { id: "60", title: "1 hour" },
    { id: "1440", title: "1 day" },
    { id: "never", title: "Never" },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="opacity-[0.7]">No user data available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-500/[0.1]">
        <h1 className="text-lg font-semibold">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Security Settings */}
        <div className="border border-gray-500/[0.1] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheckIcon size={24} className="text-primary" />
            <h2 className="text-lg font-semibold">Security</h2>
          </div>

          <div className="space-y-4">
            <SettingItemWithButton
              icon={<LockIcon size={20} />}
              title="Password"
              description="Change your account password"
              buttonText="Change"
              onButtonClick={() => setIsPasswordModalOpen(true)}
            />

            <SettingItem
              title="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
              action={
                <Toggle
                  checkedValue={twoFactorAuth}
                  onValueChange={setTwoFactorAuth}
                />
              }
            />

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="font-medium block mb-2">Session Timeout</label>
              <p className="text-sm opacity-[0.7] mb-3">Automatically log out after inactivity</p>
              <Dropdown
                options={sessionTimeouts}
                value={sessionTimeout}
                onChange={(value) => setSessionTimeout(value)}
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="border border-gray-500/[0.1] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <BellIcon size={24} className="text-primary" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <SettingItem
              title="Email Notifications"
              description="Receive email updates about your account"
              action={
                <Toggle
                  checkedValue={emailNotifications}
                  onValueChange={setEmailNotifications}
                />
              }
            />

            <SettingItem
              title="Payment Notifications"
              description="Get notified when payments are received"
              action={
                <Toggle
                  checkedValue={paymentNotifications}
                  onValueChange={setPaymentNotifications}
                />
              }
            />

            <SettingItem
              title="Link Expiry Notifications"
              description="Get reminded when payment links are about to expire"
              action={
                <Toggle
                  checkedValue={linkExpiryNotifications}
                  onValueChange={setLinkExpiryNotifications}
                />
              }
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="border border-gray-500/[0.1] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <GlobeIcon size={24} className="text-primary" />
            <h2 className="text-lg font-semibold">Preferences</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="font-medium block mb-2">Default Currency</label>
              <p className="text-sm opacity-[0.7] mb-3">Set your preferred currency for new payment links</p>
              <Dropdown
                options={currencies}
                value={defaultCurrency}
                onChange={(value) => setDefaultCurrency(value)}
              />
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <PaletteIcon size={20} className="text-gray-600" />
                <label className="font-medium">Theme</label>
              </div>
              <p className="text-sm opacity-[0.7] mb-3">Choose your preferred color theme</p>
              <Dropdown
                options={themes}
                value={theme}
                onChange={(value) => setTheme(value)}
              />
            </div>
          </div>
        </div>

        {/* About */}
        <div className="border border-gray-500/[0.1] rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">About</h2>
          <div className="space-y-2 text-sm opacity-[0.7]">
            <p>UniLinks Payment Platform</p>
            <p>Version 1.0.0</p>
            <p>© 2026 UniLinks. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        userEmail={user.email}
      />
    </div>
  );
}

export default SettingsPage;
