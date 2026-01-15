'use client';
import { useContext, useEffect } from "react";
import { useFormik } from "formik";
import { BankIcon, CurrencyCircleDollarIcon, WalletIcon, PlugsIcon } from "@phosphor-icons/react";
import Dropdown from "../dropdown/dropdown";
import Modal from "./Modal";
import Input from "../input/input";
import Button from "../button/Button";
import { useWalletConnect } from "../../customHooks/useWalletConnect";
import { AuthContext } from "../../contexts/AuthContext";
import type { PaymentMethod } from "../../interface/payments";
import { paymentMethodSchema } from "../../schema/paymentMethodSchema";

type PaymentDetails = {
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  swiftCode?: string;
  routingNumber?: string;
  walletAddress?: string;
  cryptoNetwork?: string;
  cryptoType?: string;
  paypalEmail?: string;
  paypalAccountType?: string;
  paypalBusinessName?: string;
  paypalMeUsername?: string;
  paypalCountry?: string;
  paypalCurrency?: string;
  stripeAccountId?: string;
  stripeAccountType?: string;
  stripeDisplayName?: string;
  stripeCountry?: string;
  stripeCurrency?: string;
  stripeDescription?: string;
  otherDetails?: string;
};

interface EditPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, paymentMethod: PaymentMethod) => void;
  paymentMethod: PaymentMethod | null;
}

const paymentTypeOptions = [
  { id: "bank", title: "Bank Transfer", icon: <BankIcon /> },
  { id: "crypto", title: "Cryptocurrency", icon: <WalletIcon /> },
  { id: "paypal", title: "PayPal", icon: <CurrencyCircleDollarIcon /> },
  { id: "stripe", title: "Stripe", icon: <CurrencyCircleDollarIcon /> },
  { id: "other", title: "Other", icon: <CurrencyCircleDollarIcon /> },
];

export default function EditPaymentMethodModal({ isOpen, onClose, onEdit, paymentMethod }: EditPaymentMethodModalProps) {
  const { user } = useContext(AuthContext);
  
  // Wallet connection hook
  const { address, isConnected, isConnecting, error: walletError, connectWallet, disconnectWallet } = useWalletConnect();

  const formik = useFormik({
    initialValues: {
      methodName: "",
      paymentType: "bank",
      // Bank fields
      bankName: "",
      accountNumber: "",
      accountHolderName: "",
      swiftCode: "",
      routingNumber: "",
      // Crypto fields
      walletAddress: "",
      cryptoNetwork: "",
      cryptoType: "BTC",
      // PayPal fields
      paypalEmail: "",
      paypalAccountType: "personal",
      paypalBusinessName: "",
      paypalMeUsername: "",
      paypalCountry: "",
      paypalCurrency: "USD",
      // Stripe fields
      stripeAccountId: "",
      stripeAccountType: "standard",
      stripeDisplayName: "",
      stripeCountry: "",
      stripeCurrency: "USD",
      stripeDescription: "",
      // Other fields
      otherDetails: "",
    },
    validationSchema: paymentMethodSchema,
    onSubmit: (values) => {
      const updatedPaymentMethod = {
        ...paymentMethod,
        userId: user?.id || "",
        type: values.paymentType,
        name: values.methodName,
        status: paymentMethod?.status || 'active',
        createdAt: paymentMethod?.createdAt || new Date(),
        updatedAt: new Date(),
        details: {},
      };

      switch (values.paymentType) {
        case "bank":
          updatedPaymentMethod.details = {
            bankName: values.bankName,
            accountNumber: values.accountNumber,
            accountHolderName: values.accountHolderName,
            swiftCode: values.swiftCode,
            routingNumber: values.routingNumber,
          };
          break;
        case "crypto":
          updatedPaymentMethod.details = {
            walletAddress: values.walletAddress,
            cryptoNetwork: values.cryptoNetwork,
            cryptoType: values.cryptoType,
          };
          break;
        case "paypal":
          updatedPaymentMethod.details = {
            paypalEmail: values.paypalEmail,
            paypalAccountType: values.paypalAccountType,
            paypalBusinessName: values.paypalBusinessName,
            paypalMeUsername: values.paypalMeUsername,
            paypalCountry: values.paypalCountry,
            paypalCurrency: values.paypalCurrency,
          };
          break;
        case "stripe":
          updatedPaymentMethod.details = {
            stripeAccountId: values.stripeAccountId,
            stripeAccountType: values.stripeAccountType,
            stripeDisplayName: values.stripeDisplayName,
            stripeCountry: values.stripeCountry,
            stripeCurrency: values.stripeCurrency,
            stripeDescription: values.stripeDescription,
          };
          break;
        case "other":
          updatedPaymentMethod.details = {
            otherDetails: values.otherDetails,
          };
          break;
      }

      onEdit(updatedPaymentMethod.id || "", updatedPaymentMethod);
      formik.resetForm();
      onClose();
    },
  });

  const cryptoOptions = [
    { id: "BTC", title: "Bitcoin (BTC)" },
    { id: "ETH", title: "Ethereum (ETH)" },
    { id: "USDT", title: "Tether (USDT)" },
    { id: "USDC", title: "USD Coin (USDC)" },
    { id: "BNB", title: "Binance Coin (BNB)" },
    { id: "SOL", title: "Solana (SOL)" },
    { id: "OTHER", title: "Other" },
  ];

  const networkOptions = [
    { id: "mainnet", title: "Mainnet" },
    { id: "testnet", title: "Testnet" },
    { id: "polygon", title: "Polygon" },
    { id: "bsc", title: "Binance Smart Chain" },
    { id: "arbitrum", title: "Arbitrum" },
  ];

  // Load payment method data when modal opens
  useEffect(() => {
    if (paymentMethod) {
      const details = paymentMethod.details as PaymentDetails;

      formik.setValues({
        methodName: paymentMethod.name,
        paymentType: paymentMethod.type,
        // Bank fields
        bankName: details.bankName || "",
        accountNumber: details.accountNumber || "",
        accountHolderName: details.accountHolderName || "",
        swiftCode: details.swiftCode || "",
        routingNumber: details.routingNumber || "",
        // Crypto fields
        walletAddress: details.walletAddress || "",
        cryptoNetwork: details.cryptoNetwork || "",
        cryptoType: details.cryptoType || "BTC",
        // PayPal fields
        paypalEmail: details.paypalEmail || "",
        paypalAccountType: details.paypalAccountType || "personal",
        paypalBusinessName: details.paypalBusinessName || "",
        paypalMeUsername: details.paypalMeUsername || "",
        paypalCountry: details.paypalCountry || "",
        paypalCurrency: details.paypalCurrency || "USD",
        // Stripe fields
        stripeAccountId: details.stripeAccountId || "",
        stripeAccountType: details.stripeAccountType || "standard",
        stripeDisplayName: details.stripeDisplayName || "",
        stripeCountry: details.stripeCountry || "",
        stripeCurrency: details.stripeCurrency || "USD",
        stripeDescription: details.stripeDescription || "",
        // Other fields
        otherDetails: details.otherDetails || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, paymentMethod]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Payment Method" size="md">
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <Dropdown
          label="Payment Type"
          name="paymentType"
          value={formik.values.paymentType}
          onChange={(value) => formik.setFieldValue("paymentType", value)}
          options={paymentTypeOptions}
        />

        <Input
          label="Payment Method Name"
          name="methodName"
          value={formik.values.methodName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="e.g., Main Business Account"
          error={formik.touched.methodName && formik.errors.methodName ? String(formik.errors.methodName) : undefined}
        />

        {/* Bank Transfer Fields */}
        {formik.values.paymentType === "bank" && (
          <>
            <Input
              label="Bank Name"
              name="bankName"
              value={formik.values.bankName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="e.g., Chase Bank"
              error={formik.touched.bankName && formik.errors.bankName ? String(formik.errors.bankName) : undefined}
            />
            <Input
              label="Account Holder Name"
              name="accountHolderName"
              value={formik.values.accountHolderName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Full name on account"
              error={formik.touched.accountHolderName && formik.errors.accountHolderName ? String(formik.errors.accountHolderName) : undefined}
            />
            <Input
              label="Account Number"
              name="accountNumber"
              value={formik.values.accountNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter account number"
              error={formik.touched.accountNumber && formik.errors.accountNumber ? String(formik.errors.accountNumber) : undefined}
            />
            <Input
              label="SWIFT/BIC Code (Optional)"
              name="swiftCode"
              value={formik.values.swiftCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="For international transfers"
            />
            <Input
              label="Routing Number (Optional)"
              name="routingNumber"
              value={formik.values.routingNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="For domestic transfers"
            />
          </>
        )}

        {/* Cryptocurrency Fields */}
        {formik.values.paymentType === "crypto" && (
          <>
            <Dropdown
              label="Cryptocurrency"
              name="cryptoType"
              value={formik.values.cryptoType}
              onChange={(value) => formik.setFieldValue("cryptoType", value)}
              options={cryptoOptions}
            />
            
            {/* Wallet Connection */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px]">Wallet Address</label>
              <div className="flex gap-2">
                {!isConnected && !formik.values.walletAddress ? (
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={async () => {
                      const connectedAddress = await connectWallet();
                      if (connectedAddress) {
                        formik.setFieldValue("walletAddress", connectedAddress);
                      }
                    }}
                    className="flex-1"
                    disabled={isConnecting}
                  >
                    <PlugsIcon size={18} />
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                  </Button>
                ) : isConnected ? (
                  <div className="flex-1 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-[8px]">
                    <WalletIcon size={18} className="text-green-600" />
                    <span className="text-[12px] text-green-600 font-medium">
                      Connected: {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        disconnectWallet();
                      }}
                      className="ml-auto text-[12px] text-red-600 hover:underline"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : formik.values.walletAddress ? (
                  <div className="flex-1 flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-[8px]">
                    <WalletIcon size={18} className="text-gray-600" />
                    <span className="text-[12px] text-gray-600 font-medium">
                      Saved: {formik.values.walletAddress.substring(0, 6)}...{formik.values.walletAddress.substring(formik.values.walletAddress.length - 4)}
                    </span>
                  </div>
                ) : null}
              </div>
              {walletError && (
                <p className="text-[12px] text-red-500">{walletError}</p>
              )}
            </div>

            <Input
              label="Wallet Address"
              name="walletAddress"
              value={formik.values.walletAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter wallet address manually"
              error={formik.touched.walletAddress && formik.errors.walletAddress ? String(formik.errors.walletAddress) : undefined}
            />
            <Dropdown
              label="Network"
              name="cryptoNetwork"
              value={formik.values.cryptoNetwork}
              onChange={(value) => formik.setFieldValue("cryptoNetwork", value)}
              options={networkOptions}
              error={formik.touched.cryptoNetwork && formik.errors.cryptoNetwork ? String(formik.errors.cryptoNetwork) : undefined}
            />
          </>
        )}

        {/* PayPal Fields */}
        {formik.values.paymentType === "paypal" && (
          <>
            <Input
              label="PayPal Email"
              name="paypalEmail"
              type="email"
              value={formik.values.paypalEmail}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="your@email.com"
              error={formik.touched.paypalEmail && formik.errors.paypalEmail ? String(formik.errors.paypalEmail) : undefined}
            />
            
            <Dropdown
              label="Account Type"
              name="paypalAccountType"
              value={formik.values.paypalAccountType}
              onChange={(value) => formik.setFieldValue("paypalAccountType", value)}
              options={[
                { id: "personal", title: "Personal Account" },
                { id: "business", title: "Business Account" },
              ]}
              error={formik.touched.paypalAccountType && formik.errors.paypalAccountType ? String(formik.errors.paypalAccountType) : undefined}
            />

            {formik.values.paypalAccountType === "business" && (
              <Input
                label="Business Name"
                name="paypalBusinessName"
                value={formik.values.paypalBusinessName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Your Business Name"
                error={formik.touched.paypalBusinessName && formik.errors.paypalBusinessName ? String(formik.errors.paypalBusinessName) : undefined}
              />
            )}

            <Input
              label="PayPal.Me Username (Optional)"
              name="paypalMeUsername"
              value={formik.values.paypalMeUsername}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="username (paypal.me/username)"
            />

            <Dropdown
              label="Country"
              name="paypalCountry"
              value={formik.values.paypalCountry}
              onChange={(value) => formik.setFieldValue("paypalCountry", value)}
              options={[
                { id: "US", title: "United States" },
                { id: "GB", title: "United Kingdom" },
                { id: "CA", title: "Canada" },
                { id: "AU", title: "Australia" },
                { id: "DE", title: "Germany" },
                { id: "FR", title: "France" },
                { id: "ES", title: "Spain" },
                { id: "IT", title: "Italy" },
                { id: "NL", title: "Netherlands" },
                { id: "IN", title: "India" },
                { id: "SG", title: "Singapore" },
                { id: "HK", title: "Hong Kong" },
              ]}
              error={formik.touched.paypalCountry && formik.errors.paypalCountry ? String(formik.errors.paypalCountry) : undefined}
            />

            <Dropdown
              label="Primary Currency"
              name="paypalCurrency"
              value={formik.values.paypalCurrency}
              onChange={(value) => formik.setFieldValue("paypalCurrency", value)}
              options={[
                { id: "USD", title: "USD - US Dollar" },
                { id: "EUR", title: "EUR - Euro" },
                { id: "GBP", title: "GBP - British Pound" },
                { id: "CAD", title: "CAD - Canadian Dollar" },
                { id: "AUD", title: "AUD - Australian Dollar" },
                { id: "JPY", title: "JPY - Japanese Yen" },
                { id: "CNY", title: "CNY - Chinese Yuan" },
                { id: "INR", title: "INR - Indian Rupee" },
              ]}
              error={formik.touched.paypalCurrency && formik.errors.paypalCurrency ? String(formik.errors.paypalCurrency) : undefined}
            />
          </>
        )}

        {/* Stripe Fields */}
        {formik.values.paymentType === "stripe" && (
          <>
            <Input
              label="Stripe Account ID or Publishable Key"
              name="stripeAccountId"
              value={formik.values.stripeAccountId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="acct_xxxxxxxxxxxxx or pk_live_xxxxxxxxxxxxx"
              error={formik.touched.stripeAccountId && formik.errors.stripeAccountId ? String(formik.errors.stripeAccountId) : undefined}
            />

            <Dropdown
              label="Account Type"
              name="stripeAccountType"
              value={formik.values.stripeAccountType}
              onChange={(value) => formik.setFieldValue("stripeAccountType", value)}
              options={[
                { id: "standard", title: "Standard - Full Stripe Dashboard Access" },
                { id: "express", title: "Express - Simplified Onboarding" },
                { id: "custom", title: "Custom - Fully Branded" },
              ]}
              error={formik.touched.stripeAccountType && formik.errors.stripeAccountType ? String(formik.errors.stripeAccountType) : undefined}
            />

            <Input
              label="Display Name"
              name="stripeDisplayName"
              value={formik.values.stripeDisplayName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Name shown to customers"
              error={formik.touched.stripeDisplayName && formik.errors.stripeDisplayName ? String(formik.errors.stripeDisplayName) : undefined}
            />

            <Input
              label="Country Code"
              name="stripeCountry"
              value={formik.values.stripeCountry}
              onChange={(e) => formik.setFieldValue("stripeCountry", e.target.value.toUpperCase())}
              onBlur={formik.handleBlur}
              placeholder="US, GB, CA, etc."
              maxLength={2}
              error={formik.touched.stripeCountry && formik.errors.stripeCountry ? String(formik.errors.stripeCountry) : undefined}
            />

            <Dropdown
              label="Default Currency"
              name="stripeCurrency"
              value={formik.values.stripeCurrency}
              onChange={(value) => formik.setFieldValue("stripeCurrency", value)}
              options={[
                { id: "USD", title: "USD - US Dollar" },
                { id: "EUR", title: "EUR - Euro" },
                { id: "GBP", title: "GBP - British Pound" },
                { id: "CAD", title: "CAD - Canadian Dollar" },
                { id: "AUD", title: "AUD - Australian Dollar" },
                { id: "JPY", title: "JPY - Japanese Yen" },
                { id: "SGD", title: "SGD - Singapore Dollar" },
                { id: "CHF", title: "CHF - Swiss Franc" },
              ]}
              error={formik.touched.stripeCurrency && formik.errors.stripeCurrency ? String(formik.errors.stripeCurrency) : undefined}
            />

            <div className="flex flex-col gap-2">
              <label className="text-[14px]">Description (Optional)</label>
              <textarea
                name="stripeDescription"
                value={formik.values.stripeDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Add notes about this Stripe account"
                rows={3}
                className="w-full p-3 border rounded-[8px] outline-none focus:border-primary border-gray-500/[0.2]"
              />
            </div>
          </>
        )}

        {/* Other Payment Method Fields */}
        {formik.values.paymentType === "other" && (
          <div className="flex flex-col gap-2">
            <label className="text-[14px]">Payment Details</label>
            <textarea
              name="otherDetails"
              value={formik.values.otherDetails}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter payment details and instructions"
              rows={4}
              className={`w-full p-3 border rounded-[8px] outline-none focus:border-primary ${
                formik.touched.otherDetails && formik.errors.otherDetails ? "border-red-500" : "border-gray-500/[0.2]"
              }`}
            />
            {formik.touched.otherDetails && formik.errors.otherDetails && (
              <p className="text-[12px] text-red-500">{String(formik.errors.otherDetails)}</p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 my-4">
          <Button type="submit" className="w-full whitespace-nowrap">
            Update Payment Method
          </Button>
        </div>
      </form>
    </Modal>
  );
}
