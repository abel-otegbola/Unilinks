'use client';
import { useContext, useState, useEffect } from "react";
import { BankIcon, CurrencyCircleDollarIcon, WalletIcon, Plugs } from "@phosphor-icons/react";
import Dropdown from "../dropdown/dropdown";
import Modal from "./Modal";
import Input from "../input/input";
import Button from "../button/Button";
import { useWalletConnect } from "../../customHooks/useWalletConnect";
import { AuthContext } from "../../contexts/AuthContext";
import type { PaymentMethod } from "../../interface/payments";

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
  const [paymentType, setPaymentType] = useState<string>("bank");
  const [methodName, setMethodName] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { user } = useContext(AuthContext)
  
  // Wallet connection hook
  const { address, isConnected, isConnecting, error: walletError, connectWallet, disconnectWallet } = useWalletConnect();

  // Bank fields
  const [bank, setBank] = useState({
    name: "",
    accountNumber: "",
    accountHolderName: "",
    swiftCode: "",
    routingNumber: "",
  });

  // Crypto fields
  const [crypto, setCrypto] = useState({
    walletAddress: "",
    network: "",
    type: "BTC",
  });

  // PayPal fields
  const [paypalEmail, setPaypalEmail] = useState<string>("");

  // Stripe fields
  const [stripeAccountId, setStripeAccountId] = useState<string>("");

  // Other fields
  const [otherDetails, setOtherDetails] = useState<string>("");

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

  const resetForm = () => {
    setPaymentType("bank");
    setMethodName("");
    setBank({
      name: "",
      accountNumber: "",
      accountHolderName: "",
      swiftCode: "",
      routingNumber: "",
    });
    setCrypto({
      walletAddress: "",
      network: "",
      type: "BTC",
    });
    setPaypalEmail("");
    setStripeAccountId("");
    setOtherDetails("");
    setErrors({});
  };

  // Load payment method data when modal opens
  useEffect(() => {
    if (paymentMethod) {
      const details = paymentMethod.details as PaymentDetails;

      // Batch all state updates together to avoid cascading renders
      const updates = () => {
        setPaymentType(paymentMethod.type);
        setMethodName(paymentMethod.name);

        if (paymentMethod.type === "bank") {
          setBank({
            name: details.bankName || "",
            accountNumber: details.accountNumber || "",
            accountHolderName: details.accountHolderName || "",
            swiftCode: details.swiftCode || "",
            routingNumber: details.routingNumber || "",
          });
        } else if (paymentMethod.type === "Cryptocurrency") {
          setCrypto({
            walletAddress: details.walletAddress || "",
            network: details.cryptoNetwork || "",
            type: details.cryptoType || "BTC",
          });
        } else if (paymentMethod.type === "paypal") {
          setPaypalEmail(details.paypalEmail || "");
        } else if (paymentMethod.type === "stripe") {
          setStripeAccountId(details.stripeAccountId || "");
        } else if (paymentMethod.type === "other") {
          setOtherDetails(details.otherDetails || "");
        }
      };

      // Use setTimeout to defer updates and avoid synchronous state updates in effect
      const timeoutId = setTimeout(updates, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, paymentMethod]);


  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!methodName.trim()) {
      newErrors.methodName = "Name is required";
    }

    if (paymentType === "bank") {
      if (!bank.name.trim()) newErrors.bankName = "Bank name is required";
      if (!bank.accountNumber.trim()) newErrors.accountNumber = "Account number is required";
      if (!bank.accountHolderName.trim()) newErrors.accountHolderName = "Account holder name is required";
    } else if (paymentType === "crypto") {
      if (!crypto.walletAddress.trim()) newErrors.walletAddress = "Wallet address is required";
      if (!crypto.network.trim()) newErrors.cryptoNetwork = "Network is required";
    } else if (paymentType === "paypal") {
      if (!paypalEmail.trim()) newErrors.paypalEmail = "PayPal email is required";
    } else if (paymentType === "stripe") {
      if (!stripeAccountId.trim()) newErrors.stripeAccountId = "Stripe account ID is required";
    } else if (paymentType === "other") {
      if (!otherDetails.trim()) newErrors.otherDetails = "Payment details are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const updatedPaymentMethod = {
      ...paymentMethod,
      userId: user?.id || "",
      type: paymentType,
      name: methodName,
      status: paymentMethod?.status || 'active',
      createdAt: paymentMethod?.createdAt || new Date(),
      updatedAt: new Date(),
      details: {},
    };

    switch (paymentType) {
      case "bank":
        updatedPaymentMethod.details = {
          bankName: bank.name,
          accountNumber: bank.accountNumber,
          accountHolderName: bank.accountHolderName,
          swiftCode: bank.swiftCode,
          routingNumber: bank.routingNumber,
        };
        break;
      case "Cryptocurrency":
        updatedPaymentMethod.details = {
          walletAddress: crypto.walletAddress,
          cryptoNetwork: crypto.network,
          cryptoType: crypto.type,
        };
        break;
      case "paypal":
        updatedPaymentMethod.details = {
          paypalEmail,
        };
        break;
      case "stripe":
        updatedPaymentMethod.details = {
          stripeAccountId,
        };
        break;
      case "other":
        updatedPaymentMethod.details = {
          otherDetails,
        };
        break;
    }

    onEdit(updatedPaymentMethod.id || "", updatedPaymentMethod);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Payment Method" size="md">
      <div className="flex flex-col gap-4">
        <Dropdown
          label="Payment Type"
          name="paymentType"
          value={paymentType}
          onChange={setPaymentType}
          options={paymentTypeOptions}
        />

        <Input
          label="Payment Method Name"
          name="methodName"
          value={methodName}
          onChange={(e) => setMethodName(e.target.value)}
          placeholder="e.g., Main Business Account"
          error={errors.methodName}
        />

        {/* Bank Transfer Fields */}
        {paymentType === "bank" && (
          <>
            <Input
              label="Bank Name"
              name="bankName"
              value={bank.name}
              onChange={(e) => setBank({ ...bank, name: e.target.value })}
              placeholder="e.g., Chase Bank"
              error={errors.bankName}
            />
            <Input
              label="Account Holder Name"
              name="accountHolderName"
              value={bank.accountHolderName}
              onChange={(e) => setBank({ ...bank, accountHolderName: e.target.value })}
              placeholder="Full name on account"
              error={errors.accountHolderName}
            />
            <Input
              label="Account Number"
              name="accountNumber"
              value={bank.accountNumber}
              onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })}
              placeholder="Enter account number"
              error={errors.accountNumber}
            />
            <Input
              label="SWIFT/BIC Code (Optional)"
              name="swiftCode"
              value={bank.swiftCode}
              onChange={(e) => setBank({ ...bank, swiftCode: e.target.value })}
              placeholder="For international transfers"
            />
            <Input
              label="Routing Number (Optional)"
              name="routingNumber"
              value={bank.routingNumber}
              onChange={(e) => setBank({ ...bank, routingNumber: e.target.value })}
              placeholder="For domestic transfers"
            />
          </>
        )}

        {/* Cryptocurrency Fields */}
        {paymentType === "Cryptocurrency" && (
          <>
            <Dropdown
              label="Cryptocurrency"
              name="cryptoType"
              value={crypto.type}
              onChange={(value) => setCrypto({ ...crypto, type: value })}
              options={cryptoOptions}
            />
            
            {/* Wallet Connection */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px]">Wallet Address</label>
              <div className="flex gap-2">
                {!isConnected && !crypto.walletAddress ? (
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      const connectedAddress = await connectWallet();
                      if (connectedAddress) {
                        setCrypto({ ...crypto, walletAddress: connectedAddress });
                      }
                    }}
                    className="flex-1"
                    disabled={isConnecting}
                  >
                    <Plugs size={18} />
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                  </Button>
                ) : isConnected ? (
                  <div className="flex-1 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-[8px]">
                    <WalletIcon size={18} className="text-green-600" />
                    <span className="text-[12px] text-green-600 font-medium">
                      Connected: {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
                    </span>
                    <button
                      onClick={() => {
                        disconnectWallet();
                      }}
                      className="ml-auto text-[12px] text-red-600 hover:underline"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : crypto.walletAddress ? (
                  <div className="flex-1 flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-[8px]">
                    <WalletIcon size={18} className="text-gray-600" />
                    <span className="text-[12px] text-gray-600 font-medium">
                      Saved: {crypto.walletAddress.substring(0, 6)}...{crypto.walletAddress.substring(crypto.walletAddress.length - 4)}
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
              value={crypto.walletAddress}
              onChange={(e) => setCrypto({ ...crypto, walletAddress: e.target.value })}
              placeholder="Enter wallet address manually"
              error={errors.walletAddress}
            />
            <Dropdown
              label="Network"
              name="cryptoNetwork"
              value={crypto.network}
              onChange={(value) => setCrypto({ ...crypto, network: value })}
              options={networkOptions}
              error={errors.cryptoNetwork}
            />
          </>
        )}

        {/* PayPal Fields */}
        {paymentType === "paypal" && (
          <Input
            label="PayPal Email"
            name="paypalEmail"
            type="email"
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
            placeholder="your@email.com"
            error={errors.paypalEmail}
          />
        )}

        {/* Stripe Fields */}
        {paymentType === "stripe" && (
          <Input
            label="Stripe Account ID"
            name="stripeAccountId"
            value={stripeAccountId}
            onChange={(e) => setStripeAccountId(e.target.value)}
            placeholder="acct_xxxxxxxxxxxxx"
            error={errors.stripeAccountId}
          />
        )}

        {/* Other Payment Method Fields */}
        {paymentType === "other" && (
          <div className="flex flex-col gap-2">
            <label className="text-[14px]">Payment Details</label>
            <textarea
              name="otherDetails"
              value={otherDetails}
              onChange={(e) => setOtherDetails(e.target.value)}
              placeholder="Enter payment details and instructions"
              rows={4}
              className={`w-full p-3 border rounded-[8px] outline-none focus:border-primary ${
                errors.otherDetails ? "border-red-500" : "border-gray-500/[0.2]"
              }`}
            />
            {errors.otherDetails && (
              <p className="text-[12px] text-red-500">{errors.otherDetails}</p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <Button variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            Update Payment Method
          </Button>
        </div>
      </div>
    </Modal>
  );
}
