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
  status: 'active' | 'expired' | 'completed' | 'cancelled';
  createdAt: Date;
  expiresAt: Date;
  reference: string;
  notes?: string;
  timeline: TimelineEvent[];
}

export interface PaymentLinkInput {
  amount: number;
  currency: string;
  expiresAt: Date;
  notes?: string;
  userId: string;
}

export interface TimelineEvent {
  title: string;
  date: string;
}