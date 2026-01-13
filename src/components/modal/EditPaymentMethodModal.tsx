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
  stripeAccountId?: string;
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
      // Stripe fields
      stripeAccountId: "",
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
          };
          break;
        case "stripe":
          updatedPaymentMethod.details = {
            stripeAccountId: values.stripeAccountId,
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
        // Stripe fields
        stripeAccountId: details.stripeAccountId || "",
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
        )}

        {/* Stripe Fields */}
        {formik.values.paymentType === "stripe" && (
          <Input
            label="Stripe Account ID"
            name="stripeAccountId"
            value={formik.values.stripeAccountId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="acct_xxxxxxxxxxxxx"
            error={formik.touched.stripeAccountId && formik.errors.stripeAccountId ? String(formik.errors.stripeAccountId) : undefined}
          />
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
