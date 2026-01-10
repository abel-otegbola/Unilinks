import { useContext, useState } from "react";
import Modal from "./Modal";
import Input from "../input/input";
import Dropdown from "../dropdown/dropdown";
import Button from "../button/Button";
import { PaymentLinkContext } from "../../contexts/PaymentLinkContext";
import type { PaymentLinkInput } from "../../interface/payments";
import { AuthContext } from "../../contexts/AuthContext";

interface AddPaymentLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const currencyOptions = [
  { id: "USD", title: "USD" },
  { id: "EUR", title: "EUR" },
  { id: "GBP", title: "GBP" },
  { id: "NGN", title: "NGN" },
  { id: "CAD", title: "CAD" },
  { id: "AUD", title: "AUD" },
  { id: "JPY", title: "JPY" },
];

export default function AddPaymentLinkModal({ isOpen, onClose }: AddPaymentLinkModalProps) {
  const { createPaymentLink } = useContext(PaymentLinkContext);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    amount: "",
    currency: "USD",
    expiresAt: "",
    notes: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const resetForm = () => {
    setFormData({
      amount: "",
      currency: "USD",
      expiresAt: "",
      notes: "",
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Valid amount is required";
    }

    if (!formData.currency) {
      newErrors.currency = "Currency is required";
    }

    if (!formData.expiresAt) {
      newErrors.expiresAt = "Expiration date is required";
    } else {
      const expiryDate = new Date(formData.expiresAt);
      const now = new Date();
      if (expiryDate <= now) {
        newErrors.expiresAt = "Expiration date must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const paymentLinkData: PaymentLinkInput = {
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        expiresAt: new Date(formData.expiresAt),
        notes: formData.notes,
        userId: user?.email || "unknown",
      };

      await createPaymentLink(paymentLinkData);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error creating payment link:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Payment Link" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="md:text-[18px] text-[16px] font-medium">Link Details</h3>
        
        {/* Amount and Currency Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Amount"
            name="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            error={errors.amount}
          />

          <Dropdown
            label="Currency"
            name="currency"
            value={formData.currency}
            onChange={(value) => setFormData({ ...formData, currency: value })}
            options={currencyOptions}
            error={errors.currency}
          />
        </div>

        {/* Expiration Date */}
        <Input
          label="Expiration Date"
          name="expiresAt"
          type="datetime-local"
          value={formData.expiresAt}
          onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
          error={errors.expiresAt}
        />

        {/* Notes */}
        <div className="flex flex-col gap-2">
          <label htmlFor="notes" className="text-sm">Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Add any additional notes or description..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-500/20 rounded-lg focus:border-primary focus:outline-none resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pb-4">
          <Button
            type="button"
            onClick={handleClose}
            className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Link"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
