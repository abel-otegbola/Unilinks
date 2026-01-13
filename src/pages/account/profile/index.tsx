import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { PaymentLinkContext } from "../../../contexts/PaymentLinkContext";
import { PaymentContext } from "../../../contexts/PaymentContext";
import Button from "../../../components/button/Button";
import EditProfileModal from "../../../components/modal/EditProfileModal";
import DeleteAccountModal from "../../../components/modal/DeleteAccountModal";
import { PencilIcon, TrashIcon, UserCircleIcon, EnvelopeIcon } from "@phosphor-icons/react";

function ProfilePage() {
  const { user, logout } = useContext(AuthContext);
  const { paymentLinks } = useContext(PaymentLinkContext);
  const { paymentMethods } = useContext(PaymentContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Count user's data
  const userPaymentLinks = paymentLinks;
  const userPaymentMethods = paymentMethods;

  const handleProfileUpdateSuccess = () => {
    window.location.reload();
  };

  const handleAccountDeletionSuccess = async () => {
    await logout();
  };

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
        <h1 className="text-2xl font-semibold">Profile</h1>
      </div>

      <div className="space-y-6">
        {/* Profile Information */}
        <div className="border border-gray-500/[0.1] rounded-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <Button
              onClick={() => setIsEditModalOpen(true)}
              variant="secondary"
              size="small"
              className="flex items-center gap-2"
            >
              <PencilIcon size={12} />
              Edit
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/[0.1] flex items-center justify-center">
                <UserCircleIcon size={48} className="text-primary" />
              </div>
              <div>
                <p className="text-sm opacity-[0.7]">Display Name</p>
                <p className="text-lg font-medium">{user.displayName || "Not set"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <EnvelopeIcon size={24} className="text-gray-600" />
              <div className="flex-1">
                <p className="text-sm opacity-[0.7]">Email Address</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <UserCircleIcon size={24} className="text-gray-600" />
              <div className="flex-1">
                <p className="text-sm opacity-[0.7]">User ID</p>
                <p className="font-mono text-sm">{user.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Statistics */}
        <div className="border border-gray-500/[0.1] rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Account Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-primary/[0.08] rounded-lg border border-gray-500/[0.1]">
              <p className="text-sm opacity-[0.7]">Payment Links</p>
              <p className="text-3xl font-bold text-primary">{userPaymentLinks.length}</p>
            </div>
            <div className="p-4 bg-primary/[0.08] rounded-lg border border-gray-500/[0.1]">
              <p className="text-sm opacity-[0.7]">Payment Methods</p>
              <p className="text-3xl font-bold text-primary">{userPaymentMethods.length}</p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border border-red-500/[0.3] rounded-lg p-6 bg-red-50/[0.5]">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h2>
          <p className="text-sm opacity-[0.7] mb-4">
            Once you delete your account, there is no going back. This will permanently delete your account,
            all payment links ({userPaymentLinks.length}), and all payment methods ({userPaymentMethods.length}).
          </p>
          <Button
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
          >
            <TrashIcon size={16} />
            Delete Account
          </Button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentDisplayName={user.displayName}
        currentEmail={user.email}
        onSuccess={handleProfileUpdateSuccess}
      />

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        userEmail={user.email}
        userId={user.id}
        paymentLinksCount={userPaymentLinks.length}
        paymentMethodsCount={userPaymentMethods.length}
        onSuccess={handleAccountDeletionSuccess}
      />
    </div>
  );
}

export default ProfilePage;
