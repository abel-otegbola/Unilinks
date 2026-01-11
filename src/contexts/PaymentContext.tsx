import { createContext, useState, type ReactNode, useContext, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { PaymentMethod, PaymentMethodInput } from "../interface/payments";
import { AuthContext } from "./AuthContext";

type PaymentContextValues = {
    paymentMethods: PaymentMethod[];
    loading: boolean;
    createPaymentMethod: (data: PaymentMethodInput) => Promise<string>;
    updatePaymentMethod: (id: string, data: Partial<PaymentMethodInput>) => Promise<void>;
    deletePaymentMethod: (id: string) => Promise<void>;
    getPaymentMethodById: (id: string) => PaymentMethod | undefined;
    getUserPaymentMethods: () => void;
    popup?: { type: string; msg: string; timestamp: number };
};

const PaymentContext = createContext({} as PaymentContextValues);

export { PaymentContext };

const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(AuthContext);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ type: "", msg: "", timestamp: 0 });

  // Real-time listener for payment methods - automatically loads on mount
  useEffect(() => {
    if (!user?.email) {
      setPaymentMethods([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const q = query(
      collection(db, "payment_methods"),
      where("userId", "==", user.email),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const methods = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId,
            type: data.type,
            name: data.name,
            details: data.details,
            status: data.status,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
          } as PaymentMethod;
        });
        setPaymentMethods(methods);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching payment methods:", error);
        setPopup({
          type: "error",
          msg: "Failed to load payment methods",
          timestamp: Date.now(),
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.email]);

  // Legacy function - keeping for backward compatibility
  const getUserPaymentMethods = () => {
    // Now handled automatically by useEffect above
    console.log("getUserPaymentMethods called - now handled automatically");
  };

  // Create a new payment method
  const createPaymentMethod = async (data: PaymentMethodInput): Promise<string> => {
    try {
      const paymentMethodData = {
        userId: data.userId,
        name: data.name,
        type: data.type,
        details: data.details,
        status: data.status || 'active',
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "payment_methods"), paymentMethodData);

      setPopup({
        type: "success",
        msg: "Payment method created successfully",
        timestamp: Date.now(),
      });

      return docRef.id;
    } catch (error: unknown) {
      let msg = "Failed to create payment method";
      if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
        msg = error.message;
      }
      setPopup({ type: "error", msg, timestamp: Date.now() });
      console.error("Error creating payment method:", error);
      throw error;
    }
  };

  // Update an existing payment method
  const updatePaymentMethod = async (
    id: string,
    data: Partial<PaymentMethodInput>
  ): Promise<void> => {
    if (!user?.id) {
      throw new Error("User must be logged in to update payment methods");
    }

    try {
      const paymentMethodRef = doc(db, "payment_methods", id);
      
      const updateData: Record<string, unknown> = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.type !== undefined) updateData.type = data.type;
      if (data.details !== undefined) updateData.details = data.details;
      if (data.status !== undefined) updateData.status = data.status;

      await updateDoc(paymentMethodRef, updateData);

      setPopup({
        type: "success",
        msg: "Payment method updated successfully",
        timestamp: Date.now(),
      });
    } catch (error: unknown) {
      let msg = "Failed to update payment method";
      if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
        msg = error.message;
      }
      setPopup({ type: "error", msg, timestamp: Date.now() });
      console.error("Error updating payment method:", error);
      throw error;
    }
  };

  // Delete a payment method
  const deletePaymentMethod = async (id: string): Promise<void> => {
    if (!user?.id) {
      throw new Error("User must be logged in to delete payment methods");
    }

    try {
      const paymentMethodRef = doc(db, "payment_methods", id);
      await deleteDoc(paymentMethodRef);

      setPopup({
        type: "success",
        msg: "Payment method deleted successfully",
        timestamp: Date.now(),
      });
    } catch (error: unknown) {
      let msg = "Failed to delete payment method";
      if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
        msg = error.message;
      }
      setPopup({ type: "error", msg, timestamp: Date.now() });
      console.error("Error deleting payment method:", error);
      throw error;
    }
  };

  // Get a specific payment method by ID
  const getPaymentMethodById = (id: string): PaymentMethod | undefined => {
    return paymentMethods.find((method) => method.id === id);
  };

  const value: PaymentContextValues = {
    paymentMethods,
    loading,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    getPaymentMethodById,
    getUserPaymentMethods,
    popup,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentProvider;
