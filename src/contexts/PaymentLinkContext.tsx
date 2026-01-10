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
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { PaymentLink, PaymentLinkInput, TimelineEvent } from "../interface/payments";
import { AuthContext } from "./AuthContext";

type PaymentLinkContextValues = {
  paymentLinks: PaymentLink[];
  loading: boolean;
  createPaymentLink: (data: PaymentLinkInput) => Promise<string>;
  updatePaymentLink: (id: string, data: Partial<PaymentLinkInput>) => Promise<void>;
  deletePaymentLink: (id: string) => Promise<void>;
  getPaymentLinkById: (id: string) => PaymentLink | undefined;
  addTimelineEvent: (id: string, event: TimelineEvent) => Promise<void>;
  popup?: { type: string; msg: string; timestamp: number };
};

const PaymentLinkContext = createContext({} as PaymentLinkContextValues);

export { PaymentLinkContext };

const PaymentLinkProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(AuthContext);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ type: "", msg: "", timestamp: 0 });

  // Generate a unique payment link
  const generateLink = (reference: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/pay/${reference}`;
  };

  // Generate a unique reference
  const generateReference = (): string => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `PL-${timestamp}-${randomStr}`.toUpperCase();
  };

  // Real-time listener for payment links
  useEffect(() => {

    setLoading(true);

    const q = query(
      collection(db, "payment_links"),
      where("userId", "==", user?.email || ""),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const links = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId,
            amount: data.amount,
            currency: data.currency,
            link: data.link,
            status: data.status,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
            expiresAt: data.expiresAt?.toDate ? data.expiresAt.toDate() : new Date(data.expiresAt),
            reference: data.reference,
            notes: data.notes,
            timeline: data.timeline || [],
          } as PaymentLink;
        });
        setPaymentLinks(links);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching payment links:", error);
        setPopup({
          type: "error",
          msg: "Failed to load payment links",
          timestamp: Date.now(),
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.id]);

  // Create a new payment link
  const createPaymentLink = async (data: PaymentLinkInput): Promise<string> => {
    try {
      const reference = generateReference();
      const link = generateLink(reference);
      const now = new Date();
      const createdEvent: TimelineEvent = {
        title: "Payment link created",
        date: now.toLocaleDateString('en-GB'),
      };

      const paymentLinkData = {
        userId: data.userId,
        amount: data.amount,
        currency: data.currency,
        link,
        status: 'active',
        createdAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(data.expiresAt),
        reference,
        notes: data.notes || '',
        timeline: [createdEvent],
      };

      const docRef = await addDoc(collection(db, "payment_links"), paymentLinkData);

      setPopup({
        type: "success",
        msg: "Payment link created successfully",
        timestamp: Date.now(),
      });

      return docRef.id;
    } catch (error: unknown) {
      let msg = "Failed to create payment link";
      if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
        msg = error.message;
      }
      setPopup({ type: "error", msg, timestamp: Date.now() });
      console.error("Error creating payment link:", error);
      throw error;
    }
  };

  // Update an existing payment link
  const updatePaymentLink = async (
    id: string,
    data: Partial<PaymentLinkInput>
  ): Promise<void> => {
    if (!user?.id) {
      throw new Error("User must be logged in to update payment links");
    }

    try {
      const paymentLinkRef = doc(db, "payment_links", id);
      
      const updateData: Record<string, unknown> = {};
      if (data.amount !== undefined) updateData.amount = data.amount;
      if (data.currency !== undefined) updateData.currency = data.currency;
      if (data.expiresAt !== undefined) updateData.expiresAt = Timestamp.fromDate(data.expiresAt);
      if (data.notes !== undefined) updateData.notes = data.notes;

      await updateDoc(paymentLinkRef, updateData);

      setPopup({
        type: "success",
        msg: "Payment link updated successfully",
        timestamp: Date.now(),
      });
    } catch (error: unknown) {
      let msg = "Failed to update payment link";
      if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
        msg = error.message;
      }
      setPopup({ type: "error", msg, timestamp: Date.now() });
      console.error("Error updating payment link:", error);
      throw error;
    }
  };

  // Delete a payment link
  const deletePaymentLink = async (id: string): Promise<void> => {
    if (!user?.id) {
      throw new Error("User must be logged in to delete payment links");
    }

    try {
      const paymentLinkRef = doc(db, "payment_links", id);
      await deleteDoc(paymentLinkRef);

      setPopup({
        type: "success",
        msg: "Payment link deleted successfully",
        timestamp: Date.now(),
      });
    } catch (error: unknown) {
      let msg = "Failed to delete payment link";
      if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
        msg = error.message;
      }
      setPopup({ type: "error", msg, timestamp: Date.now() });
      console.error("Error deleting payment link:", error);
      throw error;
    }
  };

  // Get a specific payment link by ID
  const getPaymentLinkById = (id: string): PaymentLink | undefined => {
    return paymentLinks.find((link) => link.id === id);
  };

  // Add a timeline event to a payment link
  const addTimelineEvent = async (id: string, event: TimelineEvent): Promise<void> => {
    if (!user?.id) {
      throw new Error("User must be logged in to update payment links");
    }

    try {
      const paymentLink = getPaymentLinkById(id);
      if (!paymentLink) {
        throw new Error("Payment link not found");
      }

      const updatedTimeline = [...paymentLink.timeline, event];
      const paymentLinkRef = doc(db, "payment_links", id);
      
      await updateDoc(paymentLinkRef, {
        timeline: updatedTimeline,
      });
    } catch (error: unknown) {
      let msg = "Failed to add timeline event";
      if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
        msg = error.message;
      }
      console.error("Error adding timeline event:", msg);
      throw error;
    }
  };

  const value: PaymentLinkContextValues = {
    paymentLinks,
    loading,
    createPaymentLink,
    updatePaymentLink,
    deletePaymentLink,
    getPaymentLinkById,
    addTimelineEvent,
    popup,
  };

  return (
    <PaymentLinkContext.Provider value={value}>
      {children}
    </PaymentLinkContext.Provider>
  );
};

export default PaymentLinkProvider;
