import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { PaymentLinkContext } from "../../../contexts/PaymentLinkContext";
import { PaymentContext } from "../../../contexts/PaymentContext";
import { getAuth, updateProfile, updateEmail, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import Input from "../../../components/input/input";
import Button from "../../../components/button/Button";
import Modal from "../../../components/modal/Modal";
import { PencilIcon, TrashIcon, UserCircleIcon, EnvelopeIcon, WarningIcon } from "@phosphor-icons/react";
import { useFormik } from "formik";
import * as Yup from "yup";

const profileSchema = Yup.object().shape({
  displayName: Yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
});

const deleteAccountSchema = Yup.object().shape({
  password: Yup.string().required("Password is required for account deletion"),
});

function ProfilePage() {
  const { user, logout } = useContext(AuthContext);
  const { paymentLinks } = useContext(PaymentLinkContext);
  const { paymentMethods } = useContext(PaymentContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const auth = getAuth();
  const currentUser = auth.currentUser;

  // Count user's data
  const userPaymentLinks = paymentLinks;
  const userPaymentMethods = paymentMethods;

  // Edit profile formik
  const editFormik = useFormik({
    initialValues: {
      displayName: user?.displayName || "",
      email: user?.email || "",
    },
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      if (!currentUser) return;

      try {
        // Update display name
        if (values.displayName !== user?.displayName) {
          await updateProfile(currentUser, {
            displayName: values.displayName,
          });
        }

        // Update email if changed
        if (values.email !== user?.email) {
          await updateEmail(currentUser, values.email);
        }

        // Update local storage
        const updatedUser = {
          ...user,
          displayName: values.displayName,
          email: values.email,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        alert("Profile updated successfully!");
        setIsEditModalOpen(false);
        window.location.reload();
      } catch (error: unknown) {
        console.error("Error updating profile:", error);
        let errorMessage = "Failed to update profile";
        
        if (error && typeof error === "object" && "code" in error) {
          if (error.code === "auth/requires-recent-login") {
            errorMessage = "Please log out and log back in to update your email";
          } else if (error.code === "auth/email-already-in-use") {
            errorMessage = "This email is already in use";
          } else if (error.code === "auth/invalid-email") {
            errorMessage = "Invalid email address";
          }
        }
        
        alert(errorMessage);
      }
    },
  });

  // Delete account formik
  const deleteFormik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: deleteAccountSchema,
    onSubmit: async (values) => {
      if (!currentUser || !user?.email) return;

      setIsDeleting(true);
      setDeleteError("");

      try {
        // Re-authenticate user before deletion
        const credential = EmailAuthProvider.credential(user.email, values.password);
        await reauthenticateWithCredential(currentUser, credential);

        // Delete all payment links
        const linksQuery = query(
          collection(db, "paymentLinks"),
          where("userId", "==", user.id)
        );
        const linksSnapshot = await getDocs(linksQuery);
        const linkDeletions = linksSnapshot.docs.map(docSnapshot =>
          deleteDoc(doc(db, "paymentLinks", docSnapshot.id))
        );
        await Promise.all(linkDeletions);

        // Delete all payment methods
        const methodsQuery = query(
          collection(db, "paymentMethods"),
          where("userId", "==", user.id)
        );
        const methodsSnapshot = await getDocs(methodsQuery);
        const methodDeletions = methodsSnapshot.docs.map(docSnapshot =>
          deleteDoc(doc(db, "paymentMethods", docSnapshot.id))
        );
        await Promise.all(methodDeletions);

        // Delete user account
        await deleteUser(currentUser);

        // Clear storage and logout
        localStorage.removeItem("user");
        localStorage.removeItem("userToken");
        sessionStorage.removeItem("userToken");

        alert("Account deleted successfully");
        await logout();
      } catch (error: unknown) {
        console.error("Error deleting account:", error);
        let errorMessage = "Failed to delete account";

        if (error && typeof error === "object" && "code" in error) {
          if (error.code === "auth/wrong-password") {
            errorMessage = "Incorrect password";
          } else if (error.code === "auth/too-many-requests") {
            errorMessage = "Too many attempts. Please try again later";
          } else if (error.code === "auth/requires-recent-login") {
            errorMessage = "Please log out and log back in before deleting your account";
          }
        }

        setDeleteError(errorMessage);
      } finally {
        setIsDeleting(false);
      }
    },
  });

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
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Profile">
        <form onSubmit={editFormik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Display Name</label>
            <Input
              type="text"
              name="displayName"
              value={editFormik.values.displayName}
              onChange={editFormik.handleChange}
              onBlur={editFormik.handleBlur}
              placeholder="Enter your name"
            />
            {editFormik.touched.displayName && editFormik.errors.displayName && (
              <p className="text-red-500 text-xs mt-1">{String(editFormik.errors.displayName)}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <Input
              type="email"
              name="email"
              value={editFormik.values.email}
              onChange={editFormik.handleChange}
              onBlur={editFormik.handleBlur}
              placeholder="Enter your email"
            />
            {editFormik.touched.email && editFormik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{String(editFormik.errors.email)}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Note: Changing your email may require you to log in again.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={editFormik.isSubmitting || !editFormik.isValid}>
              {editFormik.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Account Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Account">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <WarningIcon size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-600 mb-1">Warning: This action cannot be undone!</p>
              <p className="text-sm text-red-700">
                Deleting your account will permanently remove:
              </p>
              <ul className="text-sm text-red-700 list-disc list-inside mt-2 space-y-1">
                <li>{userPaymentLinks.length} payment link(s)</li>
                <li>{userPaymentMethods.length} payment method(s)</li>
                <li>All your account data</li>
              </ul>
            </div>
          </div>

          <form onSubmit={deleteFormik.handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Enter your password to confirm
              </label>
              <Input
                type="password"
                name="password"
                value={deleteFormik.values.password}
                onChange={deleteFormik.handleChange}
                onBlur={deleteFormik.handleBlur}
                placeholder="Enter your password"
              />
              {deleteFormik.touched.password && deleteFormik.errors.password && (
                <p className="text-red-500 text-xs mt-1">{String(deleteFormik.errors.password)}</p>
              )}
              {deleteError && (
                <p className="text-red-500 text-xs mt-1">{deleteError}</p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting || !deleteFormik.isValid}
              >
                {isDeleting ? "Deleting..." : "Delete My Account"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  deleteFormik.resetForm();
                  setDeleteError("");
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default ProfilePage;
