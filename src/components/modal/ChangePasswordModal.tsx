import { useState } from "react";
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useFormik } from "formik";
import Modal from "./Modal";
import Input from "../input/input";
import Button from "../button/Button";
import { getPasswordChangeErrorMessage } from "../../utils/helpers/firebaseErrorHandler";
import { changePasswordSchema } from "../../schema/passwordSchema";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export default function ChangePasswordModal({ isOpen, onClose, userEmail }: ChangePasswordModalProps) {
  const [passwordError, setPasswordError] = useState("");
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: changePasswordSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!currentUser || !userEmail) return;

      setPasswordError("");

      try {
        // Re-authenticate user
        const credential = EmailAuthProvider.credential(userEmail, values.currentPassword);
        await reauthenticateWithCredential(currentUser, credential);

        // Update password
        await updatePassword(currentUser, values.newPassword);

        alert("Password changed successfully!");
        resetForm();
        onClose();
      } catch (error: unknown) {
        console.error("Error changing password:", error);
        const errorMessage = getPasswordChangeErrorMessage(error);
        setPasswordError(errorMessage);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setPasswordError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change Password">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Current Password</label>
          <Input
            type="password"
            name="currentPassword"
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter current password"
          />
          {formik.touched.currentPassword && formik.errors.currentPassword && (
            <p className="text-red-500 text-xs mt-1">{String(formik.errors.currentPassword)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">New Password</label>
          <Input
            type="password"
            name="newPassword"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter new password"
          />
          {formik.touched.newPassword && formik.errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">{String(formik.errors.newPassword)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Confirm New Password</label>
          <Input
            type="password"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Confirm new password"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{String(formik.errors.confirmPassword)}</p>
          )}
        </div>

        {passwordError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{passwordError}</p>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={formik.isSubmitting || !formik.isValid}>
            {formik.isSubmitting ? "Changing..." : "Change Password"}
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
    </Modal>
  );
}
