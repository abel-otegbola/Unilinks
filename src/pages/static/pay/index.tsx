import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { CardsIcon, CopyIcon, CheckCircleIcon, Clock } from "@phosphor-icons/react";
import type { PaymentLink, PaymentMethod } from "../../../interface/payments";
import { formatCurrency } from "../../../utils/helpers/formatCurrency";
import { formatDate } from "../../../utils/helpers/formatDate";
import Button from "../../../components/button/Button";

function PaymentPage() {
    const { reference } = useParams<{ reference: string }>();
    const [paymentLink, setPaymentLink] = useState<PaymentLink | null>(null);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

    useEffect(() => {
        const fetchPaymentLink = async () => {
            if (!reference) return;

            try {
                setLoading(true);

                // Query payment link by reference
                const q = query(
                    collection(db, "payment_links"),
                    where("reference", "==", reference)
                );

                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setError("Payment link not found");
                    setLoading(false);
                    return;
                }

                const linkDoc = querySnapshot.docs[0];
                const data = linkDoc.data();

                const link: PaymentLink = {
                    id: linkDoc.id,
                    userId: data.userId,
                    amount: data.amount,
                    currency: data.currency,
                    link: data.link,
                    status: data.status,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
                    expiresAt: data.expiresAt?.toDate ? data.expiresAt.toDate() : new Date(data.expiresAt),
                    reference: data.reference,
                    notes: data.notes,
                    timeline: data.timeline || [],
                    paymentMethodIds: data.paymentMethodIds || [],
                };

                // Check if link is expired
                if (new Date() > link.expiresAt) {
                    setError("This payment link has expired");
                    setPaymentLink(link);
                    setLoading(false);
                    return;
                }

                // Check if link is still active
                if (link.status !== 'active') {
                    setError(`This payment link is ${link.status}`);
                    setPaymentLink(link);
                    setLoading(false);
                    return;
                }

                setPaymentLink(link);

                // Fetch payment methods
                if (link.paymentMethodIds && link.paymentMethodIds.length > 0) {
                    const methodsPromises = link.paymentMethodIds.map(async (methodId) => {
                        const methodDoc = await getDoc(doc(db, "payment_methods", methodId));
                        if (methodDoc.exists()) {
                            const methodData = methodDoc.data();
                            return {
                                id: methodDoc.id,
                                userId: methodData.userId,
                                type: methodData.type,
                                name: methodData.name,
                                details: methodData.details,
                                status: methodData.status,
                                createdAt: methodData.createdAt?.toDate ? methodData.createdAt.toDate() : new Date(methodData.createdAt),
                            } as PaymentMethod;
                        }
                        return null;
                    });

                    const methods = await Promise.all(methodsPromises);
                    setPaymentMethods(methods.filter(m => m !== null) as PaymentMethod[]);
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching payment link:", err);
                setError("Failed to load payment link");
                setLoading(false);
            }
        };

        fetchPaymentLink();
    }, [reference]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading payment details...</p>
                </div>
            </div>
        );
    }

    if (error && !paymentLink) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <p className="text-red-600 text-lg font-medium">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!paymentLink) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600">Payment link not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Request</h1>
                    <p className="text-gray-600">Reference: {paymentLink.reference}</p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800 text-center">{error}</p>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Payment Details Card */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                        
                        {/* Amount */}
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/[0.08] border border-primary/20 mb-6">
                            <div className="p-3 rounded-full bg-primary/[0.1]">
                                <CardsIcon size={24} className="text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm text-gray-600">Amount</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(paymentLink.amount, paymentLink.currency)}
                                </p>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="space-y-3">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Status</span>
                                <span className="font-medium capitalize">{paymentLink.status}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Created</span>
                                <span className="font-medium">{formatDate(paymentLink.createdAt)}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-gray-600 flex items-center gap-1">
                                    <Clock size={16} />
                                    Expires
                                </span>
                                <span className="font-medium">{formatDate(paymentLink.expiresAt)}</span>
                            </div>
                        </div>

                        {/* Notes */}
                        {paymentLink.notes && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">Notes</p>
                                <p className="text-gray-900">{paymentLink.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Payment Methods Card */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
                        
                        {paymentMethods.length > 0 ? (
                            <div className="space-y-3">
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        onClick={() => setSelectedMethod(method.id || null)}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                            selectedMethod === method.id
                                                ? 'border-primary bg-primary/[0.05]'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-gray-900">{method.name}</h3>
                                            {selectedMethod === method.id && (
                                                <CheckCircleIcon size={20} className="text-primary" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 capitalize mb-3">{method.type}</p>

                                        {/* Display relevant details based on payment type */}
                                        {selectedMethod === method.id && (
                                            <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                                                {method.type === 'bank' && (
                                                    <>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">Bank Name:</span>
                                                            <span className="font-medium">{method.details.bankName}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">Account Holder:</span>
                                                            <span className="font-medium">{method.details.accountHolderName}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-600">Account Number:</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium font-mono">{method.details.accountNumber}</span>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        copyToClipboard(method.details.accountNumber);
                                                                    }}
                                                                    className="text-primary hover:text-primary/80"
                                                                >
                                                                    <CopyIcon size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {method.details.swiftCode && (
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-600">SWIFT/BIC:</span>
                                                                <span className="font-medium">{method.details.swiftCode}</span>
                                                            </div>
                                                        )}
                                                        {method.details.routingNumber && (
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-600">Routing Number:</span>
                                                                <span className="font-medium">{method.details.routingNumber}</span>
                                                            </div>
                                                        )}
                                                    </>
                                                )}

                                                {method.type === 'crypto' && (
                                                    <>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">Cryptocurrency:</span>
                                                            <span className="font-medium">{method.details.cryptoType}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">Network:</span>
                                                            <span className="font-medium capitalize">{method.details.cryptoNetwork}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-600">Wallet Address:</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium font-mono text-xs">
                                                                    {method.details.walletAddress.substring(0, 6)}...
                                                                    {method.details.walletAddress.substring(method.details.walletAddress.length - 4)}
                                                                </span>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        copyToClipboard(method.details.walletAddress);
                                                                    }}
                                                                    className="text-primary hover:text-primary/80"
                                                                >
                                                                    <CopyIcon size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {method.type === 'paypal' && (
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600">PayPal Email:</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">{method.details.paypalEmail}</span>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    copyToClipboard(method.details.paypalEmail);
                                                                }}
                                                                className="text-primary hover:text-primary/80"
                                                            >
                                                                <CopyIcon size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {method.type === 'stripe' && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Stripe Account ID:</span>
                                                        <span className="font-medium font-mono text-xs">{method.details.stripeAccountId}</span>
                                                    </div>
                                                )}

                                                {method.type === 'other' && (
                                                    <div className="text-sm">
                                                        <p className="text-gray-600 mb-1">Payment Details:</p>
                                                        <p className="font-medium">{method.details.otherDetails}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No payment methods available</p>
                            </div>
                        )}

                        {/* Confirm Payment Button */}
                        {paymentMethods.length > 0 && !error && (
                            <div className="mt-6">
                                <Button
                                    onClick={() => {
                                        // Handle payment confirmation
                                        alert('Payment confirmation functionality would be implemented here');
                                    }}
                                    disabled={!selectedMethod}
                                    className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {selectedMethod ? 'I Have Made Payment' : 'Select a Payment Method'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentPage;
