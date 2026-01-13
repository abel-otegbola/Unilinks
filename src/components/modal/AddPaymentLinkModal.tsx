import { useContext, useState } from "react";
import { useFormik } from "formik";
import Modal from "./Modal";
import Input from "../input/input";
import Dropdown from "../dropdown/dropdown";
import Button from "../button/Button";
import { PaymentLinkContext } from "../../contexts/PaymentLinkContext";
import { PaymentContext } from "../../contexts/PaymentContext";
import type { PaymentLinkInput } from "../../interface/payments";
import { AuthContext } from "../../contexts/AuthContext";
import { paymentLinkSchema } from "../../schema/paymentLinkSchema";

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
  const { paymentMethods } = useContext(PaymentContext);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  
  const formik = useFormik({
    initialValues: {
      amount: "",
      currency: "USD",
      expiresAt: "",
      notes: "",
      paymentMethodIds: [] as string[],
    },
    validationSchema: paymentLinkSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);

      try {
        const paymentLinkData: PaymentLinkInput = {
          paymentMethodIds: values.paymentMethodIds,
          amount: parseFloat(values.amount),
          currency: values.currency,
          expiresAt: new Date(values.expiresAt),
          notes: values.notes,
          userId: user?.id || "unknown",
        };

        await createPaymentLink(paymentLinkData);
        resetForm();
        onClose();
      } catch (error) {
        console.error("Error creating payment link:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Payment Link" size="md">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <h3 className="md:text-[18px] text-[16px] font-medium">Link Details</h3>
        
        {/* Amount and Currency Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Amount"
            name="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.amount && formik.errors.amount ? String(formik.errors.amount) : undefined}
          />

          <Dropdown
            label="Currency"
            name="currency"
            value={formik.values.currency}
            onChange={(value) => formik.setFieldValue("currency", value)}
            options={currencyOptions}
            error={formik.touched.currency && formik.errors.currency ? String(formik.errors.currency) : undefined}
          />
        </div>

        {/* Payment Methods */}
        <div className="flex flex-col gap-2">
          <label className="text-sm">Payment Methods</label>
          <div className="border border-gray-500/20 rounded-lg p-3 max-h-48 overflow-y-auto">
            {paymentMethods && paymentMethods.length > 0 ? (
              paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formik.values.paymentMethodIds.includes(method.id || "")}
                    onChange={(e) => {
                      const methodId = method.id || "";
                      if (e.target.checked) {
                        formik.setFieldValue("paymentMethodIds", [...formik.values.paymentMethodIds, methodId]);
                      } else {
                        formik.setFieldValue(
                          "paymentMethodIds",
                          formik.values.paymentMethodIds.filter(id => id !== methodId)
                        );
                      }
                    }}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm flex-1">
                    {method.name} <span className="text-gray-500">({method.type})</span>
                  </span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No payment methods available. Please add a payment method first.
              </p>
            )}
          </div>
          {formik.touched.paymentMethodIds && formik.errors.paymentMethodIds && (
            <p className="text-xs text-red-500">{formik.errors.paymentMethodIds}</p>
          )}
        </div>

        {/* Expiration Date */}
        <Input
          label="Expiration Date"
          name="expiresAt"
          type="datetime-local"
          value={formik.values.expiresAt}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.expiresAt && formik.errors.expiresAt ? String(formik.errors.expiresAt) : undefined}
        />

        {/* Notes */}
        <div className="flex flex-col gap-2">
          <label htmlFor="notes" className="text-sm">Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Add any additional notes or description..."
            value={formik.values.notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-3 py-2 border border-gray-500/20 rounded-lg focus:border-primary focus:outline-none resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pb-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Link"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
