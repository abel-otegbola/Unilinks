import { CreditCardIcon, CheckCircleIcon, PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { useContext, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PaymentContext } from "../../../contexts/PaymentContext";
import { PaymentLinkContext } from "../../../contexts/PaymentLinkContext";
import type { PaymentMethod } from "../../../interface/payments";
import { getStatusColor } from "../../../utils/helpers/getStatusColor";
import { formatDate } from "../../../utils/helpers/formatDate";
import { formatCurrency } from "../../../utils/helpers/formatCurrency";
import { Link } from "react-router-dom";
import Button from "../../../components/button/Button";
import EditPaymentMethodModal from "../../../components/modal/EditPaymentMethodModal";

function SinglePaymentMethodPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getPaymentMethodById, updatePaymentMethod, deletePaymentMethod } = useContext(PaymentContext);
    const { paymentLinks } = useContext(PaymentLinkContext);
    const paymentMethod = useMemo(() => getPaymentMethodById(id || ""), [id, getPaymentMethodById]);
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Get payment links that use this payment method
    const linkedPaymentLinks = useMemo(() => {
        if (!paymentMethod?.id) return [];
        return paymentLinks.filter(link => 
            link.paymentMethodIds?.includes(paymentMethod.id || "")
        );
    }, [paymentMethod, paymentLinks]);

    const handleEditPaymentMethod = async (id: string, updatedMethod: PaymentMethod) => {
        try {
            await updatePaymentMethod(id, {
                name: updatedMethod.name,
                type: updatedMethod.type,
                status: updatedMethod.status,
                details: updatedMethod.details,
                userId: updatedMethod.userId,
            });
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating payment method:', error);
            alert('Failed to update payment method');
        }
    };

    const handleDeletePaymentMethod = async () => {
        if (!paymentMethod?.id) return;
        
        const confirmed = window.confirm(
            'Are you sure you want to delete this payment method? This action cannot be undone.'
        );
        
        if (!confirmed) return;
        
        try {
            setIsDeleting(true);
            await deletePaymentMethod(paymentMethod.id);
            navigate('/account/payment-methods');
        } catch (error) {
            console.error('Error deleting payment method:', error);
            alert('Failed to delete payment method');
        } finally {
            setIsDeleting(false);
        }
    };

    if (!paymentMethod) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="opacity-[0.7]">Payment method not found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex md:flex-nowrap flex-wrap gap-8">
            <div className="flex flex-col md:w-[65%] w-full 2xl:gap-8 md:gap-6 gap-4 2xl:px-12 md:px-6">
                <div className="flex items-center justify-between gap-4 flex-wrap py-4 border-b border-gray-500/[0.1]">
                    <h1 className="md:text-[18px] text-[16px] font-medium capitalize leading-[28px]">Payment Method</h1>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(paymentMethod.status)}`}>
                        {paymentMethod.status}
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        <PencilIcon size={16} />
                        Edit Method
                    </Button>
                    
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={handleDeletePaymentMethod}
                        disabled={isDeleting}
                        className="!text-red-600 !border-red-600 hover:!bg-red-50"
                    >
                        <TrashIcon size={16} />
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>

                <div className="flex items-center gap-2 md:p-6 p-4 rounded-lg bg-primary/[0.08] border border-gray-500/[0.1]">
                    <div className="p-3 rounded-full bg-primary/[0.08]"><CreditCardIcon size={24} /></div>
                    <div className="flex flex-col">
                        <h2 className="opacity-[0.7] text-[12px]">Payment Method</h2>
                        <p className="text-[20px] font-semibold">{paymentMethod.name}</p>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="flex flex-col gap-1 p-4 border border-gray-500/[0.1] rounded-lg">
                    <p className="font-semibold mb-2">Method Details</p>
                    <div className="flex items-center justify-between">
                        <p className="opacity-[0.7]">Name</p>
                        <p className="text-sm font-medium mt-1">{paymentMethod.name}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="opacity-[0.7]">Type</p>
                        <p className="text-sm font-medium mt-1 capitalize">{paymentMethod.type}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="opacity-[0.7]">Status</p>
                        <span className={`inline-block mt-1 px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(paymentMethod.status)}`}>
                            {paymentMethod.status}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="opacity-[0.7]">Created</p>
                        <p className="text-sm font-medium mt-1">{formatDate(paymentMethod.createdAt)}</p>
                    </div>
                </div>

                {/* Payment Details */}
                <div className="flex flex-col gap-3 p-4 border border-gray-500/[0.1] rounded-lg">
                    <p className="font-semibold mb-2">Payment Information</p>
                    <div className="space-y-2">
                        {Object.entries(paymentMethod.details).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <p className="opacity-[0.7] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                <p className="text-sm font-medium truncate">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Linked Payment Links */}
                {linkedPaymentLinks.length > 0 && (
                    <div className="flex flex-col gap-3 p-4 border border-gray-500/[0.1] rounded-lg">
                        <p className="font-semibold">Payment Links Using This Method ({linkedPaymentLinks.length})</p>
                        <div className="space-y-3">
                            {linkedPaymentLinks.map((link) => (
                                <Link 
                                    key={link.id} 
                                    to={`/account/payment-links/${link.id}`}
                                    className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-500/[0.1] hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                #{link.reference}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatCurrency(link.amount, link.currency)}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(link.status)}`}>
                                            {link.status}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col gap-8">
                {/* Statistics Box */}
                <div className="border border-gray-500/[0.1] rounded-lg p-4">
                    <p className="font-semibold mb-2 border-b border-gray-500/[0.1] pb-2">Statistics</p>
                    <div className="py-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">Total Links</p>
                                <p className="text-2xl font-bold text-primary">{linkedPaymentLinks.length}</p>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">Active Links</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {linkedPaymentLinks.filter(link => link.status === 'active').length}
                                </p>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {linkedPaymentLinks.filter(link => link.status === 'completed').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Method Type Info */}
                <div className="border border-gray-500/[0.1] rounded-lg p-4">
                    <p className="font-semibold mb-2 border-b border-gray-500/[0.1] pb-2">Type Information</p>
                    <div className="py-4">
                        <div className="flex items-center gap-3 p-4 bg-primary/[0.05] rounded-lg">
                            <CheckCircleIcon size={32} className="text-primary" />
                            <div>
                                <p className="font-medium capitalize">{paymentMethod.type}</p>
                                <p className="text-xs text-gray-600 mt-1">
                                    {paymentMethod.type === 'bank' && 'Bank transfer payment method'}
                                    {paymentMethod.type === 'crypto' && 'Cryptocurrency payment method'}
                                    {paymentMethod.type === 'paypal' && 'PayPal payment method'}
                                    {paymentMethod.type === 'stripe' && 'Stripe payment method'}
                                    {paymentMethod.type === 'other' && 'Custom payment method'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Payment Method Modal */}
            <EditPaymentMethodModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onEdit={handleEditPaymentMethod}
                paymentMethod={paymentMethod}
            />
        </div>
    );
}

export default SinglePaymentMethodPage;
