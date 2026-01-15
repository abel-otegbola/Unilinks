import * as Yup from "yup";

// Base schema for common fields
const basePaymentMethodSchema = {
  methodName: Yup.string()
    .required("Payment method name is required")
    .trim()
    .min(2, "Name must be at least 2 characters"),
  
  paymentType: Yup.string()
    .required("Payment type is required")
    .oneOf(["bank", "crypto", "paypal", "stripe", "other"], "Invalid payment type"),
};

// Bank-specific schema
export const bankPaymentMethodSchema = Yup.object().shape({
  ...basePaymentMethodSchema,
  paymentType: Yup.string().equals(["bank"]),
  bankName: Yup.string()
    .required("Bank name is required")
    .trim(),
  accountNumber: Yup.string()
    .required("Account number is required")
    .trim(),
  accountHolderName: Yup.string()
    .required("Account holder name is required")
    .trim(),
  swiftCode: Yup.string().optional(),
  routingNumber: Yup.string().optional(),
});

// Crypto-specific schema
export const cryptoPaymentMethodSchema = Yup.object().shape({
  ...basePaymentMethodSchema,
  paymentType: Yup.string().equals(["crypto"]),
  walletAddress: Yup.string()
    .required("Wallet address is required")
    .trim()
    .min(26, "Invalid wallet address"),
  cryptoNetwork: Yup.string()
    .required("Network is required")
    .oneOf(["mainnet", "testnet", "polygon", "bsc", "arbitrum"], "Invalid network"),
  cryptoType: Yup.string()
    .required("Cryptocurrency type is required")
    .oneOf(["BTC", "ETH", "USDT", "USDC", "BNB", "SOL", "OTHER"], "Invalid cryptocurrency"),
});

// PayPal-specific schema
export const paypalPaymentMethodSchema = Yup.object().shape({
  ...basePaymentMethodSchema,
  paymentType: Yup.string().equals(["paypal"]),
  paypalEmail: Yup.string()
    .required("PayPal email is required")
    .email("Invalid email format")
    .trim(),
  paypalAccountType: Yup.string()
    .required("Account type is required")
    .oneOf(["personal", "business"], "Invalid account type"),
  paypalBusinessName: Yup.string().when("paypalAccountType", {
    is: "business",
    then: (schema) => schema.required("Business name is required").trim(),
    otherwise: (schema) => schema.optional(),
  }),
  paypalMeUsername: Yup.string().optional().trim(),
  paypalCountry: Yup.string()
    .required("Country is required")
    .trim(),
  paypalCurrency: Yup.string()
    .required("Primary currency is required")
    .oneOf(["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CNY", "INR"], "Invalid currency"),
});

// Stripe-specific schema
export const stripePaymentMethodSchema = Yup.object().shape({
  ...basePaymentMethodSchema,
  paymentType: Yup.string().equals(["stripe"]),
  stripeAccountId: Yup.string()
    .required("Stripe account ID or publishable key is required")
    .trim(),
  stripeAccountType: Yup.string()
    .required("Account type is required")
    .oneOf(["standard", "express", "custom"], "Invalid account type"),
  stripeDisplayName: Yup.string()
    .required("Display name is required")
    .trim()
    .min(2, "Display name must be at least 2 characters"),
  stripeCountry: Yup.string()
    .required("Country is required")
    .trim()
    .length(2, "Country code must be 2 characters (e.g., US, GB)"),
  stripeCurrency: Yup.string()
    .required("Default currency is required")
    .oneOf(["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "SGD", "CHF"], "Invalid currency"),
  stripeDescription: Yup.string().optional().trim(),
});

// Other-specific schema
export const otherPaymentMethodSchema = Yup.object().shape({
  ...basePaymentMethodSchema,
  paymentType: Yup.string().equals(["other"]),
  otherDetails: Yup.string()
    .required("Payment details are required")
    .trim()
    .min(5, "Details must be at least 5 characters"),
});

// Dynamic schema that validates based on payment type
export const paymentMethodSchema = Yup.object().shape({
  methodName: Yup.string()
    .required("Payment method name is required")
    .trim()
    .min(2, "Name must be at least 2 characters"),
  
  paymentType: Yup.string()
    .required("Payment type is required")
    .oneOf(["bank", "crypto", "paypal", "stripe", "other"], "Invalid payment type"),
  
  // Bank fields
  bankName: Yup.string().when("paymentType", {
    is: "bank",
    then: (schema) => schema.required("Bank name is required").trim(),
    otherwise: (schema) => schema.optional(),
  }),
  accountNumber: Yup.string().when("paymentType", {
    is: "bank",
    then: (schema) => schema.required("Account number is required").trim(),
    otherwise: (schema) => schema.optional(),
  }),
  accountHolderName: Yup.string().when("paymentType", {
    is: "bank",
    then: (schema) => schema.required("Account holder name is required").trim(),
    otherwise: (schema) => schema.optional(),
  }),
  swiftCode: Yup.string().optional(),
  routingNumber: Yup.string().optional(),
  
  // Crypto fields
  walletAddress: Yup.string().when("paymentType", {
    is: "crypto",
    then: (schema) => schema.required("Wallet address is required").trim().min(26, "Invalid wallet address"),
    otherwise: (schema) => schema.optional(),
  }),
  cryptoNetwork: Yup.string().when("paymentType", {
    is: "crypto",
    then: (schema) => schema.required("Network is required"),
    otherwise: (schema) => schema.optional(),
  }),
  cryptoType: Yup.string().when("paymentType", {
    is: "crypto",
    then: (schema) => schema.required("Cryptocurrency type is required"),
    otherwise: (schema) => schema.optional(),
  }),
  
  // PayPal fields
  paypalEmail: Yup.string().when("paymentType", {
    is: "paypal",
    then: (schema) => schema.required("PayPal email is required").email("Invalid email format").trim(),
    otherwise: (schema) => schema.optional(),
  }),
  paypalAccountType: Yup.string().when("paymentType", {
    is: "paypal",
    then: (schema) => schema.required("Account type is required"),
    otherwise: (schema) => schema.optional(),
  }),
  paypalBusinessName: Yup.string().optional(),
  paypalMeUsername: Yup.string().optional(),
  paypalCountry: Yup.string().when("paymentType", {
    is: "paypal",
    then: (schema) => schema.required("Country is required"),
    otherwise: (schema) => schema.optional(),
  }),
  paypalCurrency: Yup.string().when("paymentType", {
    is: "paypal",
    then: (schema) => schema.required("Primary currency is required"),
    otherwise: (schema) => schema.optional(),
  }),
  
  // Stripe fields
  stripeAccountId: Yup.string().when("paymentType", {
    is: "stripe",
    then: (schema) => schema.required("Stripe account ID is required").trim(),
    otherwise: (schema) => schema.optional(),
  }),
  stripeAccountType: Yup.string().when("paymentType", {
    is: "stripe",
    then: (schema) => schema.required("Account type is required"),
    otherwise: (schema) => schema.optional(),
  }),
  stripeDisplayName: Yup.string().when("paymentType", {
    is: "stripe",
    then: (schema) => schema.required("Display name is required"),
    otherwise: (schema) => schema.optional(),
  }),
  stripeCountry: Yup.string().when("paymentType", {
    is: "stripe",
    then: (schema) => schema.required("Country is required"),
    otherwise: (schema) => schema.optional(),
  }),
  stripeCurrency: Yup.string().when("paymentType", {
    is: "stripe",
    then: (schema) => schema.required("Default currency is required"),
    otherwise: (schema) => schema.optional(),
  }),
  stripeDescription: Yup.string().optional(),
  
  // Other fields
  otherDetails: Yup.string().when("paymentType", {
    is: "other",
    then: (schema) => schema.required("Payment details are required").trim().min(5, "Details must be at least 5 characters"),
    otherwise: (schema) => schema.optional(),
  }),
});

export type PaymentMethodFormValues = Yup.InferType<typeof paymentMethodSchema>;
