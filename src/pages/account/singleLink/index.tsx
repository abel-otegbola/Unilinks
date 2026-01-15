import { CardsIcon, DownloadSimpleIcon, QrCodeIcon, PencilIcon, TrashIcon, CheckCircleIcon, FacebookLogo, WhatsappLogo, TwitterLogo, LinkedinLogo, TelegramLogo, ShareNetworkIcon } from "@phosphor-icons/react";
import { useContext, useMemo, useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import QRCode from "qrcode";
import { downloadQRCodeAsPDF } from "../../../utils/helpers/downloadQRCodePDF";
import { PaymentLinkContext } from "../../../contexts/PaymentLinkContext";
import { PaymentContext } from "../../../contexts/PaymentContext";
import { copyToClipboard } from "../../../utils/helpers/copyToClipboard";
import Button from "../../../components/button/Button";
import Input from "../../../components/input/input";
import { formatCurrency } from "../../../utils/helpers/formatCurrency";
import { getStatusColor } from "../../../utils/helpers/getStatusColor";
import { formatDate } from "../../../utils/helpers/formatDate";
import EditPaymentLinkModal from "../../../components/modal/EditPaymentLinkModal";
import CountdownTimer from "../../../components/countdown/CountdownTimer";

function SingleLinkPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getPaymentLinkById, deletePaymentLink, addTimelineEvent } = useContext(PaymentLinkContext);
    const { paymentMethods } = useContext(PaymentContext);
    const paymentLink = useMemo(() => getPaymentLinkById(id || ""), [id, getPaymentLinkById]);
    const qrCodeCanvasRef = useRef<HTMLCanvasElement>(null);
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCompletingPayment, setIsCompletingPayment] = useState(false);

    // Get payment methods for this link
    const linkPaymentMethods = useMemo(() => {
        if (!paymentLink?.paymentMethodIds) return [];
        return paymentMethods.filter(method => 
            paymentLink.paymentMethodIds?.includes(method.id || "")
        );
    }, [paymentLink, paymentMethods]);

    // Check if link has expired and update status
    useEffect(() => {
        const checkExpiration = async () => {
            if (!paymentLink?.id || !paymentLink.expiresAt) return;
            
            const now = new Date();
            const expiryDate = paymentLink.expiresAt;
            
            // Check if link has expired and status is still active or pending
            if (expiryDate < now && (paymentLink.status === 'active' || paymentLink.status === 'pending')) {
                try {
                    const linkRef = doc(db, "payment_links", paymentLink.id);
                    await updateDoc(linkRef, {
                        status: 'expired',
                    });
                    
                    // Add timeline event for expiration
                    await addTimelineEvent(paymentLink.id, {
                        title: 'Payment link expired',
                        date: new Date().toLocaleString(),
                    });
                    
                    console.log('Payment link marked as expired');
                } catch (error) {
                    console.error('Error updating expired status:', error);
                }
            }
        };

        checkExpiration();
    }, [paymentLink, addTimelineEvent]);

    // Generate QR Code
    useEffect(() => {
        if (paymentLink && qrCodeCanvasRef.current) {
            QRCode.toCanvas(
                qrCodeCanvasRef.current,
                paymentLink.link,
                {
                    width: 200,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF',
                    },
                },
                (error) => {
                    if (error) console.error('Error generating QR code:', error);
                }
            );
        }
    }, [paymentLink]);

    const handleDownloadQRCode = async () => {
        if (!paymentLink || !qrCodeCanvasRef.current) return;

        try {
            await downloadQRCodeAsPDF(qrCodeCanvasRef.current, {
                reference: paymentLink.reference,
                amount: paymentLink.amount,
                currency: paymentLink.currency,
                link: paymentLink.link,
            });
        } catch {
            alert('Failed to generate PDF');
        }
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleDeletePaymentLink = async () => {
        if (!paymentLink?.id) return;
        
        const confirmed = window.confirm(
            'Are you sure you want to delete this payment link? This action cannot be undone.'
        );
        
        if (!confirmed) return;
        
        try {
            setIsDeleting(true);
            await deletePaymentLink(paymentLink.id);
            navigate('/account/payment-links');
        } catch (error) {
            console.error('Error deleting payment link:', error);
            alert('Failed to delete payment link');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCompletePayment = async () => {
        setIsCompletingPayment(true);
        if (!paymentLink?.id) return;
        try {
            // Update the payment link with completed status
            const linkRef = doc(db, "payment_links", paymentLink.id);
            await updateDoc(linkRef, {
                status: 'completed',
            });
        } catch (error) {
            console.error('Error completing payment:', error);
            alert('Failed to complete payment');
        } finally {
            setIsCompletingPayment(false);
        }
    };

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

                {/* Action Buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={() => setIsEditModalOpen(true)}
                        disabled={paymentLink.status === 'completed' || paymentLink.status === 'cancelled'}
                    >
                        <PencilIcon size={16} />
                        Edit Link
                    </Button>
                    
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={handleCompletePayment}
                        disabled={paymentLink.status === 'completed' || paymentLink.status === 'cancelled' || isCompletingPayment}
                    >
                        <CheckCircleIcon size={16} />
                        {isCompletingPayment ? 'Processing...' : 'Complete Payment'}
                    </Button>
                    
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={handleDeletePaymentLink}
                        disabled={isDeleting}
                        className="!text-red-600 !border-red-600 hover:!bg-red-50"
                    >
                        <TrashIcon size={16} />
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
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
                        <p className="text-sm font-medium mt-1">{formatDate(paymentLink.createdAt)} at {paymentLink.createdAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="opacity-[0.7]">Expires</p>
                        <div className="flex items-center gap-1">
                            <CountdownTimer expiresAt={paymentLink.expiresAt} />
                            <p className="">{formatDate(paymentLink.expiresAt)} at {paymentLink.expiresAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</p>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {paymentLink.notes && (
                    <div>
                    <p className="opacity-[0.7]">Notes</p>
                    <p className="">{paymentLink.notes}</p>
                    </div>
                )}

                {/* Uploads */}
                {paymentLink.uploads && paymentLink.uploads.length > 0 && (
                    <div className="flex flex-col gap-3 p-4 border border-gray-500/[0.1] rounded-lg">
                        <p className="font-semibold">Payment Proofs ({paymentLink.uploads.length})</p>
                        <div className="space-y-3">
                            {paymentLink.uploads.map((upload, index) => (
                                <div key={index} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-500/[0.1]">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {upload.fileName}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Uploaded {formatDate(upload.uploadedAt instanceof Date ? upload.uploadedAt : (upload.uploadedAt as unknown as { toDate: () => Date }).toDate())}
                                            </p>
                                            {upload.uploadedBy && (
                                                <p className="text-xs text-gray-500">
                                                    By: {upload.uploadedBy}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <a
                                        href={upload.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline flex items-center gap-1"
                                    >
                                        <DownloadSimpleIcon size={14} />
                                        View/Download
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col gap-8">
                {/* Timeline Box */}
                <div className="border border-gray-500/[0.1] rounded-lg p-4">
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

                {/* Payment Methods Box */}
                <div className="border border-gray-500/[0.1] rounded-lg p-4">
                    <p className="font-semibold mb-2 border-b border-gray-500/[0.1] pb-2">Payment Methods</p>
                    <div className="py-4">
                        <div className="space-y-3">
                            {linkPaymentMethods.length > 0 ? (
                                linkPaymentMethods.map((method, index) => (
                                    <div key={method.id || index} className="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg border border-gray-500/[0.1]">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-900">{method.name}</p>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(method.status)}`}>
                                                {method.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 capitalize">{method.type}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">No payment methods added</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* QR Code Box */}
                <div className="border border-gray-500/[0.1] rounded-lg p-4">
                    <p className="font-semibold mb-2 border-b border-gray-500/[0.1] pb-2">QR Code</p>
                    <div className="py-4 flex flex-col items-center gap-4">
                        {/* Hidden canvas for QR generation */}
                        <canvas ref={qrCodeCanvasRef} className="hidden" />
                        
                        {/* Display QR Code */}
                        <div className="p-4 bg-white rounded-lg border border-gray-500/[0.2] shadow-sm">
                            <div className="w-[200px] h-[200px] flex items-center justify-center">
                                {paymentLink.link ? (
                                    <canvas
                                        ref={(canvas) => {
                                            if (canvas && paymentLink) {
                                                QRCode.toCanvas(
                                                    canvas,
                                                    paymentLink.link,
                                                    {
                                                        width: 200,
                                                        margin: 2,
                                                        color: {
                                                            dark: '#000000',
                                                            light: '#FFFFFF',
                                                        },
                                                    }
                                                );
                                            }
                                        }}
                                    />
                                ) : (
                                    <QrCodeIcon size={48} className="text-gray-300" />
                                )}
                            </div>
                        </div>

                        <p className="text-xs text-center text-gray-500">
                            Scan this code to access the payment link
                        </p>

                        {/* Download Button */}
                        <Button
                            onClick={handleDownloadQRCode}
                            className="w-full flex items-center justify-center gap-2"
                            variant="secondary"
                        >
                            <DownloadSimpleIcon size={18} />
                            Download as PDF
                        </Button>
                    </div>
                </div>

                {/* Share Box */}
                <div className="border border-gray-500/[0.1] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2 border-b border-gray-500/[0.1] pb-2">
                        <ShareNetworkIcon size={16} />
                        <p className="font-semibold">Share Link</p>
                    </div>
                    <div className="py-4">
                        <p className="text-xs text-gray-500 mb-3">Share this payment link via social media</p>
                        <div className="flex items-center gap-2">
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(paymentLink.link)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 bg-[#1877F2] text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
                            >
                                <FacebookLogo size={20} weight="fill" />
                            </a>
                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(`Payment Link: ${paymentLink.link}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 bg-[#25D366] text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
                            >
                                <WhatsappLogo size={20} weight="fill" />
                            </a>
                            <a
                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(paymentLink.link)}&text=${encodeURIComponent('Payment Link')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
                            >
                                <TwitterLogo size={20} weight="fill" />
                            </a>
                            <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(paymentLink.link)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 bg-[#0A66C2] text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
                            >
                                <LinkedinLogo size={20} weight="fill" />
                            </a>
                            <a
                                href={`https://t.me/share/url?url=${encodeURIComponent(paymentLink.link)}&text=${encodeURIComponent('Payment Link')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 bg-[#0088cc] text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
                            >
                                <TelegramLogo size={20} weight="fill" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Payment Link Modal */}
            <EditPaymentLinkModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                paymentLink={paymentLink}
            />
        </div>
    )
}

export default SingleLinkPage