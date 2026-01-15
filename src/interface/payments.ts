export interface PaymentMethod {
  id?: string;
  userId: string;
  type: string;
  name: string;
  details: {
    [key: string]: string;
  };
  status: string;
  createdAt: Date;
}

export interface PaymentMethodInput {
  userId: string;
  name: string;
  type: string;
  status: string;
  details: {
    [key: string]: string;
  };
}

export interface PaymentLink {
  id?: string;
  userId: string;
  amount: number;
  currency: string;
  link: string;
  status: 'active' | 'expired' | 'completed' | 'cancelled' | 'pending';
  createdAt: Date;
  expiresAt: Date;
  reference: string;
  notes?: string;
  paymentMethodIds?: string[];
  timeline: TimelineEvent[];
  uploads?: PaymentProof[];
}

export interface PaymentProof {
  url: string;
  fileName: string;
  uploadedAt: Date;
  uploadedBy?: string;
}

export interface PaymentLinkInput {
  amount: number;
  currency: string;
  expiresAt: Date;
  notes?: string;
  userId: string;
  paymentMethodIds?: string[];
  status?: string
}

export interface TimelineEvent {
  title: string;
  date: string;
}