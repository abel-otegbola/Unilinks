import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import type { PaymentMethod } from '../interface/payments';

export function usePaymentLinks(userId: string) {
  const [links, setLinks] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "payment_methods"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    // This listener catches updates from the Confluent Sink automatically
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const linkData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLinks(linkData as PaymentMethod[]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { links, loading };
}