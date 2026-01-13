import * as Yup from "yup";

export const paymentLinkSchema = Yup.object().shape({
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive")
    .typeError("Amount must be a valid number"),
  
  currency: Yup.string()
    .required("Currency is required")
    .oneOf(["USD", "EUR", "GBP", "NGN", "CAD", "AUD", "JPY"], "Invalid currency"),
  
  expiresAt: Yup.date()
    .required("Expiration date is required")
    .min(new Date(), "Expiration date must be in the future")
    .typeError("Invalid date format"),
  
  notes: Yup.string()
    .optional(),
  
  paymentMethodIds: Yup.array()
    .of(Yup.string().required())
    .min(1, "At least one payment method is required")
    .required("Payment methods are required"),
});

export type PaymentLinkFormValues = Yup.InferType<typeof paymentLinkSchema>;
