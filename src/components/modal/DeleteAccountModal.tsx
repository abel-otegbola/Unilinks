import { useState } from "react";
import { getAuth, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";
import Input from "../input/input";
import Button from "../button/Button";
import { WarningIcon } from "@phosphor-icons/react";
import { getAccountDeletionErrorMessage } from "../../utils/helpers/firebaseErrorHandler";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userId: string;
  paymentLinksCount: number;
  paymentMethodsCount: number;
  onSuccess: () => void;
}

const deleteAccountSchema = Yup.object().shape({
  password: Yup.string().required("Password is required for account deletion"),
});

export default function DeleteAccountModal({ 
  isOpen, 
  onClose, 
  userEmail, 
  userId,
  paymentLinksCount,
  paymentMethodsCount,
  onSuccess 
}: DeleteAccountModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: deleteAccountSchema,
    onSubmit: async (values) => {
      if (!currentUser || !userEmail) return;

      setIsDeleting(true);
      setDeleteError("");

      try {
        // Re-authenticate user before deletion
        const credential = EmailAuthProvider.credential(userEmail, values.password);
        await reauthenticateWithCredential(currentUser, credential);

        // Delete all payment links
        const linksQuery = query(
          collection(db, "paymentLinks"),
          where("userId", "==", userId)
        );
        const linksSnapshot = await getDocs(linksQuery);
        const linkDeletions = linksSnapshot.docs.map(docSnapshot =>
          deleteDoc(doc(db, "paymentLinks", docSnapshot.id))
        );
        await Promise.all(linkDeletions);

        // Delete all payment methods
        const methodsQuery = query(
          collection(db, "paymentMethods"),
          where("userId", "==", userId)
        );
        const methodsSnapshot = await getDocs(methodsQuery);
        const methodDeletions = methodsSnapshot.docs.map(docSnapshot =>
          deleteDoc(doc(db, "paymentMethods", docSnapshot.id))
        );
        await Promise.all(methodDeletions);

        // Delete user account
        await deleteUser(currentUser);

        // Clear storage
        localStorage.removeItem("user");
        localStorage.removeItem("userToken");
        sessionStorage.removeItem("userToken");

        alert("Account deleted successfully");
        onSuccess();
      } catch (error: unknown) {
        console.error("Error deleting account:", error);
        const errorMessage = getAccountDeletionErrorMessage(error);
        setDeleteError(errorMessage);
      } finally {
        setIsDeleting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setDeleteError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Delete Account">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <WarningIcon size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-600 mb-1">Warning: This action cannot be undone!</p>
            <p className="text-sm text-red-700">
              Deleting your account will permanently remove:
            </p>
            <ul className="text-sm text-red-700 list-disc list-inside mt-2 space-y-1">
              <li>{paymentLinksCount} payment link(s)</li>
              <li>{paymentMethodsCount} payment method(s)</li>
              <li>All your account data</li>
            </ul>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Enter your password to confirm
            </label>
            <Input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your password"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">{String(formik.errors.password)}</p>
            )}
            {deleteError && (
              <p className="text-red-500 text-xs mt-1">{deleteError}</p>
            )}
          </div>

          <div className="flex gap-2 py-4">
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting || !formik.isValid}
            >
              {isDeleting ? "Deleting..." : "Delete My Account"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
