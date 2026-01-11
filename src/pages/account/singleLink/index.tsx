import { CardsIcon } from "@phosphor-icons/react";
import { useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { PaymentLinkContext } from "../../../contexts/PaymentLinkContext";
import { copyToClipboard } from "../../../utils/helpers/copyToClipboard";
import Button from "../../../components/button/Button";
import Input from "../../../components/input/input";
import { formatCurrency } from "../../../utils/helpers/formatCurrency";
import { getStatusColor } from "../../../utils/helpers/getStatusColor";
import { formatDate } from "../../../utils/helpers/formatDate";

function SingleLinkPage() {
    const { id } = useParams<{ id: string }>();
    const { getPaymentLinkById } = useContext(PaymentLinkContext);
    const paymentLink = useMemo(() => getPaymentLinkById(id || ""), [id, getPaymentLinkById]);

    if (!paymentLink) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="opacity-[0.7]">Payment link not found.</p>
                </div>
            </div>
        );
    }


    return (
        <div className="flex md:flex-nowrap flex-wrap gap-8">
            <div className="flex flex-col md:w-[65%] w-full 2xl:gap-8 md:gap-6 gap-4 2xl:px-12 md:px-6">
                <div className="flex items-center justify-between gap-4 flex-wrap py-4 border-b border-gray-500/[0.1]">
                    <h1 className="md:text-[18px] text-[16px] font-medium capitalize leading-[28px]">Payment link</h1>
                    <p> #{paymentLink.reference}</p>
                </div>

                <div className="flex items-center gap-2 md:p-6 p-4 rounded-lg bg-primary/[0.08] border border-gray-500/[0.1]">
                    <div className="p-3 rounded-full bg-primary/[0.08]"><CardsIcon size={24} /></div>
                    <div className="flex flex-col">
                        <h2 className="opacity-[0.7] text-[12px]">Amount</h2>
                        <p className="text-[20px] font-semibold">{paymentLink.currency} {paymentLink.amount}</p>
                    </div>
                </div>

                {/* Link */}
                <div className="flex flex-col gap-2 py-4">
                    <p className="opacity-[0.7]">Payment Link</p>
                    <div className="flex items-center gap-2 mt-1">
                        <Input
                            type="text"
                            value={paymentLink.link}
                            readOnly
                        />
                        <Button
                            onClick={() => copyToClipboard(paymentLink.link)}
                        >
                        Copy
                        </Button>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="flex flex-col gap-1 p-4 border border-gray-500/[0.1] rounded-lg">
                    <p className="font-semibold mb-2">Payment Details</p>
                    <div className="flex items-center justify-between">
                        <p className="opacity-[0.7]">Amount</p>
                        <p className="text-sm font-medium mt-1">
                        {formatCurrency(paymentLink.amount, paymentLink.currency)}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="opacity-[0.7]">Status</p>
                        <span className={`inline-block mt-1 px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(paymentLink.status)}`}>
                        {paymentLink.status}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="opacity-[0.7]">Created</p>
                        <p className="text-sm font-medium mt-1">{formatDate(paymentLink.createdAt)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="opacity-[0.7]">Expires</p>
                        <p className="text-sm font-medium mt-1">{formatDate(paymentLink.expiresAt)}</p>
                    </div>
                </div>

                {/* Notes */}
                {paymentLink.notes && (
                    <div>
                    <p className="opacity-[0.7]">Notes</p>
                    <p className="">{paymentLink.notes}</p>
                    </div>
                )}
            </div>

            <div className="flex-1 fex flex-col gap-8 border border-gray-500/[0.1] rounded-lg p-4">
                <p className="font-semibold mb-2 border-b border-gray-500/[0.1] pb-2">Timeline</p>
                <div className="py-4">
                <div className="space-y-3">
                  {paymentLink.timeline.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full bg-primary"></div>
                        {index < paymentLink.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </div>
    )
}

export default SingleLinkPage