import { CardsIcon, DownloadSimpleIcon, QrCodeIcon } from "@phosphor-icons/react";
import { useContext, useMemo, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import { PaymentLinkContext } from "../../../contexts/PaymentLinkContext";
import { PaymentContext } from "../../../contexts/PaymentContext";
import { copyToClipboard } from "../../../utils/helpers/copyToClipboard";
import Button from "../../../components/button/Button";
import Input from "../../../components/input/input";
import { formatCurrency } from "../../../utils/helpers/formatCurrency";
import { getStatusColor } from "../../../utils/helpers/getStatusColor";
import { formatDate } from "../../../utils/helpers/formatDate";

function SingleLinkPage() {
    const { id } = useParams<{ id: string }>();
    const { getPaymentLinkById } = useContext(PaymentLinkContext);
    const { paymentMethods } = useContext(PaymentContext);
    const paymentLink = useMemo(() => getPaymentLinkById(id || ""), [id, getPaymentLinkById]);
    const qrCodeCanvasRef = useRef<HTMLCanvasElement>(null);

    // Get payment methods for this link
    const linkPaymentMethods = useMemo(() => {
        if (!paymentLink?.paymentMethodIds) return [];
        return paymentMethods.filter(method => 
            paymentLink.paymentMethodIds?.includes(method.id || "")
        );
    }, [paymentLink, paymentMethods]);

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

    const downloadQRCodeAsPDF = async () => {
        if (!paymentLink || !qrCodeCanvasRef.current) return;

        try {
            // Generate QR code as data URL
            const qrDataUrl = qrCodeCanvasRef.current.toDataURL('image/png');

            // Create PDF
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            // Add title
            pdf.setFontSize(20);
            pdf.text('Payment Link QR Code', 105, 20, { align: 'center' });

            // Add reference
            pdf.setFontSize(12);
            pdf.text(`Reference: ${paymentLink.reference}`, 105, 30, { align: 'center' });

            // Add amount
            pdf.setFontSize(14);
            pdf.text(
                `Amount: ${formatCurrency(paymentLink.amount, paymentLink.currency)}`,
                105,
                40,
                { align: 'center' }
            );

            // Add QR code (centered)
            const qrSize = 100;
            const xPos = (210 - qrSize) / 2; // Center on A4 width (210mm)
            pdf.addImage(qrDataUrl, 'PNG', xPos, 50, qrSize, qrSize);

            // Add link text below QR code
            pdf.setFontSize(10);
            pdf.text('Scan to pay or visit:', 105, 160, { align: 'center' });
            pdf.setFontSize(9);
            pdf.text(paymentLink.link, 105, 167, { align: 'center' });

            // Add footer
            pdf.setFontSize(8);
            pdf.setTextColor(128);
            pdf.text(
                `Generated on ${formatDate(new Date())}`,
                105,
                280,
                { align: 'center' }
            );

            // Save PDF
            pdf.save(`payment-link-${paymentLink.reference}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF');
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
                            onClick={downloadQRCodeAsPDF}
                            className="w-full flex items-center justify-center gap-2"
                            variant="secondary"
                        >
                            <DownloadSimpleIcon size={18} />
                            Download as PDF
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleLinkPage