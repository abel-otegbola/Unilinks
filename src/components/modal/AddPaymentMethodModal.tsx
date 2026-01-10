'use client';
import { useContext, useState } from "react";
import { BankIcon, CurrencyCircleDollarIcon, WalletIcon, Plugs } from "@phosphor-icons/react";
import Dropdown from "../dropdown/dropdown";
import Modal from "./Modal";
import Input from "../input/input";
import Button from "../button/Button";
import { useWalletConnect } from "../../customHooks/useWalletConnect";
import { AuthContext } from "../../contexts/AuthContext";
import type { PaymentMethod } from "../../interface/payments";

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (paymentMethod: PaymentMethod) => void;
}

const paymentTypeOptions = [
  { id: "bank", title: "Bank Transfer", icon: <BankIcon /> },
  { id: "crypto", title: "Cryptocurrency", icon: <WalletIcon /> },
  { id: "paypal", title: "PayPal", icon: <CurrencyCircleDollarIcon /> },
  { id: "stripe", title: "Stripe", icon: <CurrencyCircleDollarIcon /> },
  { id: "other", title: "Other", icon: <CurrencyCircleDollarIcon /> },
];

export default function AddPaymentMethodModal({ isOpen, onClose, onAdd }: AddPaymentMethodModalProps) {
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

    const paymentMethod = {
      userId: user?.id || "",
      type: paymentType,
      name: methodName,
      status: 'active',
      createdAt: new Date(),
      details: {},
    };

    switch (paymentType) {
      case "bank":
        paymentMethod.details = {
          bankName: bank.name,
          accountNumber: bank.accountNumber,
          accountHolderName: bank.accountHolderName,
          swiftCode: bank.swiftCode,
          routingNumber: bank.routingNumber,
        };
        break;
      case "crypto":
        paymentMethod.details = {
          walletAddress: crypto.walletAddress,
          cryptoNetwork: crypto.network,
          cryptoType: crypto.type,
        };
        break;
      case "paypal":
        paymentMethod.details = {
          paypalEmail,
        };
        break;
      case "stripe":
        paymentMethod.details = {
          stripeAccountId,
        };
        break;
      case "other":
        paymentMethod.details = {
          otherDetails,
        };
        break;
    }

    onAdd(paymentMethod);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Payment Method" size="md">
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
                {!isConnected ? (
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
                ) : (
                  <div className="flex-1 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-[8px]">
                    <WalletIcon size={18} className="text-green-600" />
                    <span className="text-[12px] text-green-600 font-medium">
                      Connected: {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
                    </span>
                    <button
                      onClick={() => {
                        disconnectWallet();
                        setCrypto({ ...crypto, walletAddress: "" });
                      }}
                      className="ml-auto text-[12px] text-red-600 hover:underline"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
              {walletError && (
                <p className="text-[12px] text-red-500">{walletError}</p>
              )}
            </div>

            <Input
              label="Or Enter Manually"
              name="walletAddress"
              value={crypto.walletAddress}
              onChange={(e) => setCrypto({ ...crypto, walletAddress: e.target.value })}
              placeholder="Enter wallet address"
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
            Add Payment Method
          </Button>
        </div>
      </div>
    </Modal>
  );
}
