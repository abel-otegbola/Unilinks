/**
 * Get user-friendly error message from Firebase auth error
 */
export const getFirebaseAuthErrorMessage = (error: unknown, defaultMessage: string = "An error occurred"): string => {
  if (!error || typeof error !== "object") return defaultMessage;
  
  const firebaseError = error as { code?: string; message?: string };
  
  if (!firebaseError.code) return defaultMessage;

  // Authentication errors
  const errorMessages: Record<string, string> = {
    // Login/Signup errors
    "auth/user-not-found": "No user found with this email",
    "auth/wrong-password": "Incorrect password",
    "auth/invalid-email": "Invalid email address",
    "auth/email-already-in-use": "Email is already registered",
    "auth/weak-password": "Password is too weak. Use at least 6 characters",
    
    // Password change errors
    "auth/requires-recent-login": "Please log out and log back in to perform this action",
    "auth/too-many-requests": "Too many attempts. Please try again later",
    
    // Social sign-in errors
    "auth/popup-closed-by-user": "Sign-in popup was closed",
    "auth/account-exists-with-different-credential": "An account already exists with this email using a different sign-in method",
    "auth/popup-blocked": "Sign-in popup was blocked by the browser",
    "auth/cancelled-popup-request": "Sign-in was cancelled",
    
    // General errors
    "auth/network-request-failed": "Network error. Please check your connection",
    "auth/operation-not-allowed": "This operation is not allowed",
    "auth/user-disabled": "This account has been disabled",
  };

  return errorMessages[firebaseError.code] || firebaseError.message || defaultMessage;
};

/**
 * Get user-friendly error message for password change errors
 */
export const getPasswordChangeErrorMessage = (error: unknown): string => {
  return getFirebaseAuthErrorMessage(error, "Failed to change password");
};

/**
 * Get user-friendly error message for account deletion errors
 */
export const getAccountDeletionErrorMessage = (error: unknown): string => {
  return getFirebaseAuthErrorMessage(error, "Failed to delete account");
};

/**
 * Get user-friendly error message for profile update errors
 */
export const getProfileUpdateErrorMessage = (error: unknown): string => {
  return getFirebaseAuthErrorMessage(error, "Failed to update profile");
};
