import { useState } from "react";
import { UploadSimpleIcon, XIcon, CheckCircleIcon, WarningIcon } from "@phosphor-icons/react";
import Modal from "./Modal";
import Button from "../button/Button";

interface PaymentConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (file: File) => Promise<void>;
    paymentAmount: string;
    paymentMethod: string;
}

export default function PaymentConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    paymentAmount,
    paymentMethod,
}: PaymentConfirmationModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string>("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
        if (!validTypes.includes(selectedFile.type)) {
            setError("Please upload an image (JPEG, PNG, GIF) or PDF file");
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (selectedFile.size > maxSize) {
            setError("File size must be less than 5MB");
            return;
        }

        setFile(selectedFile);
        setError("");

        // Create preview for images
        if (selectedFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            setError("Please select a file to upload");
            return;
        }

        setIsUploading(true);
        try {
            await onConfirm(file);
            handleClose();
        } catch (error) {
            console.error("Upload error:", error);
            setError("Failed to upload proof of payment. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setPreview(null);
        setError("");
        setIsUploading(false);
        onClose();
    };

    const removeFile = () => {
        setFile(null);
        setPreview(null);
        setError("");
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Confirm Payment" size="md">
            <div className="space-y-6">
                {/* Info Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <CheckCircleIcon size={24} className="text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-blue-900 mb-1">Payment Confirmation</h4>
                            <p className="text-sm text-blue-700">
                                You're confirming a payment of <span className="font-bold">{paymentAmount}</span> via <span className="font-bold">{paymentMethod}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div>
                    <h3 className="font-semibold mb-2">Upload Proof of Payment</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Please upload a screenshot or receipt showing your payment transaction. This helps us verify your payment quickly.
                    </p>
                </div>

                {/* File Upload Area */}
                <div>
                    {!file ? (
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadSimpleIcon size={48} className="text-gray-400 mb-3" />
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF or PDF (MAX. 5MB)</p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                            />
                        </label>
                    ) : (
                        <div className="border-2 border-gray-300 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <CheckCircleIcon size={24} className="text-green-600" />
                                    <div>
                                        <p className="font-medium text-sm">{file.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={removeFile}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    disabled={isUploading}
                                >
                                    <XIcon size={20} className="text-gray-500" />
                                </button>
                            </div>

                            {/* Image Preview */}
                            {preview && (
                                <div className="mt-3">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                        <WarningIcon size={20} className="text-red-600 mt-0.5" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs text-yellow-800">
                        <strong>Note:</strong> Once submitted, your payment will be marked as pending and reviewed by the merchant. 
                        Make sure your proof of payment is clear and readable.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        onClick={handleClose}
                        variant="secondary"
                        className="flex-1"
                        disabled={isUploading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        className="flex-1"
                        disabled={!file || isUploading}
                    >
                        {isUploading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Uploading...</span>
                            </div>
                        ) : (
                            "Submit Payment Proof"
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
