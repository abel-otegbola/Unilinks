import { useState } from "react";
import { getAuth, updateProfile, updateEmail } from "firebase/auth";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";
import Input from "../input/input";
import Button from "../button/Button";
import { getProfileUpdateErrorMessage } from "../../utils/helpers/firebaseErrorHandler";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDisplayName: string;
  currentEmail: string;
  onSuccess: () => void;
}

const profileSchema = Yup.object().shape({
  displayName: Yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
});

export default function EditProfileModal({ 
  isOpen, 
  onClose, 
  currentDisplayName, 
  currentEmail,
  onSuccess 
}: EditProfileModalProps) {
  const [updateError, setUpdateError] = useState("");
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const formik = useFormik({
    initialValues: {
      displayName: currentDisplayName,
      email: currentEmail,
    },
    enableReinitialize: true,
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      if (!currentUser) return;

      setUpdateError("");

      try {
        // Update display name
        if (values.displayName !== currentDisplayName) {
          await updateProfile(currentUser, {
            displayName: values.displayName,
          });
        }

        // Update email if changed
        if (values.email !== currentEmail) {
          await updateEmail(currentUser, values.email);
        }

        // Update local storage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const updatedUser = {
            ...userData,
            displayName: values.displayName,
            email: values.email,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        alert("Profile updated successfully!");
        onSuccess();
        onClose();
      } catch (error: unknown) {
        console.error("Error updating profile:", error);
        const errorMessage = getProfileUpdateErrorMessage(error);
        setUpdateError(errorMessage);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setUpdateError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Profile">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Display Name</label>
          <Input
            type="text"
            name="displayName"
            value={formik.values.displayName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your name"
          />
          {formik.touched.displayName && formik.errors.displayName && (
            <p className="text-red-500 text-xs mt-1">{String(formik.errors.displayName)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <Input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your email"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-xs mt-1">{String(formik.errors.email)}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Note: Changing your email may require you to log in again.
          </p>
        </div>

        {updateError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{updateError}</p>
          </div>
        )}

        <div className="flex gap-2 py-4">
          <Button type="submit" disabled={formik.isSubmitting || !formik.isValid}>
            {formik.isSubmitting ? "Saving..." : "Save Changes"}
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
