import { createContext, useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../customHooks/useLocaStorage";
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase/firebase";
import type { IUser } from "../interface/Auth";

type values = {
    user: IUser | null;
    loading: boolean;
    login: (username: string, password: string, remember: boolean, callbackUrl: string) => Promise<void>;
    logout: () => Promise<void>;
    signup: (email: string, password: string, displayName: string, callbackURL?: string) => Promise<void>;
    socialSignIn: (provider: 'google' | 'facebook' | 'github') => Promise<void>;
    popup?: { type: string; msg: string; timestamp: number };
}

const AuthContext = createContext({} as values);

export { AuthContext };

const AuthProvider = ({ children }: { children: ReactNode}) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [popup, setPopup] = useState({ type: "", msg: "", timestamp: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const auth = getAuth(app);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName
      } : 'Not authenticated');
      
      if (firebaseUser) {
        const userData: IUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || "",
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const login = async (email: string, password: string, remember: boolean, callbackUrl?: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle setting the user
      
      setPopup({ 
        type: "success", 
        msg: "Logged in successfully", 
        timestamp: Date.now() 
      });

      navigate(callbackUrl || "/account");
    } catch (error: unknown) {
        let msg = "Login failed";
        if (error && typeof error === "object" && "code" in error) {
          if (error.code === "auth/user-not-found") {
            msg = "No user found with this email";
          } else if (error.code === "auth/wrong-password") {
            msg = "Incorrect password";
          } else if (error.code === "auth/invalid-email") {
            msg = "Invalid email address";
          }
        }
        if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
          msg = error.message;
        }
        setPopup({ type: "error", msg, timestamp: Date.now() });
        console.error("Login failed:", msg);
        throw error;
    } finally {
        setLoading(false);
    }
  };

  const signup = async (email: string, password: string, displayName: string, callbackURL?: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update user profile with display name
      if (displayName) {
        await updateProfile(firebaseUser, {
          displayName: displayName
        });
      }
      // onAuthStateChanged will handle setting the user

      setPopup({ 
        type: "success", 
        msg: "Account created successfully", 
        timestamp: Date.now() 
      });

      navigate(callbackURL || "/account");
    } catch (error: unknown) {
        let msg = "Signup failed";
        if (error && typeof error === "object" && "code" in error) {
          if (error.code === "auth/email-already-in-use") {
            msg = "Email is already registered";
          } else if (error.code === "auth/invalid-email") {
            msg = "Invalid email address";
          } else if (error.code === "auth/weak-password") {
            msg = "Password is too weak. Use at least 6 characters";
          }
        }
        if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
          msg = error.message;
        }
        setPopup({ type: "error", msg, timestamp: Date.now() });
        console.error("Signup failed:", msg);
        throw error;
    } finally {
        setLoading(false);
    }
  };

  const socialSignIn = async (provider: 'google' | 'facebook' | 'github') => {
    setLoading(true);
    try {
      let authProvider;
      
      switch (provider) {
        case 'google':
          authProvider = new GoogleAuthProvider();
          break;
        case 'facebook':
          authProvider = new FacebookAuthProvider();
          break;
        case 'github':
          authProvider = new GithubAuthProvider();
          break;
        default:
          throw new Error('Invalid provider');
      }

      await signInWithPopup(auth, authProvider);
      // onAuthStateChanged will handle setting the user

      setPopup({ 
        type: "success", 
        msg: `Signed in with ${provider} successfully`, 
        timestamp: Date.now() 
      });

      navigate("/account");
    } catch (error: unknown) {
        let msg = "Social sign-in failed";
        if (error && typeof error === "object" && "code" in error) {
          if (error.code === "auth/popup-closed-by-user") {
            msg = "Sign-in popup was closed";
          } else if (error.code === "auth/account-exists-with-different-credential") {
            msg = "An account already exists with this email using a different sign-in method";
          } else if (error.code === "auth/popup-blocked") {
            msg = "Sign-in popup was blocked by the browser";
          } else if (error.code === "auth/cancelled-popup-request") {
            msg = "Sign-in was cancelled";
          }
        }
        if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
          msg = error.message;
        }
        setPopup({ type: "error", msg, timestamp: Date.now() });
        console.error("Social sign-in failed:", msg);
        throw error;
    } finally {
        setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // onAuthStateChanged will handle clearing the user
      
      setPopup({ 
        type: "success", 
        msg: "Logged out successfully", 
        timestamp: Date.now() 
      });
      
      navigate("/");
    } catch (error: unknown) {
      let msg = "Logout failed";
      if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
        msg = error.message;
      }
      setPopup({ type: "error", msg, timestamp: Date.now() });
      console.error("Logout failed:", msg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, signup, socialSignIn, popup }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;