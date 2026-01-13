import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon, CurrencyCircleDollarIcon } from "@phosphor-icons/react";
import Button from "../../../components/button/Button";
import Input from "../../../components/input/input";

function PayLookupPage() {
    const [reference, setReference] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!reference.trim()) {
            setError("Please enter a payment reference");
            return;
        }

        // Navigate to the payment page
        navigate(`/pay/${reference.trim()}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 flex items-center justify-center px-4 py-8">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <CurrencyCircleDollarIcon size={48} className="text-primary" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Find Your Payment Link</h1>
                    <p className="text-gray-600 text-lg">
                        Enter your payment reference to access your payment link
                    </p>
                </div>

                {/* Search Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="reference" className="text-sm font-medium text-gray-700">
                                Payment Reference
                            </label>
                            <div className="relative">
                                <Input
                                    id="reference"
                                    name="reference"
                                    type="text"
                                    placeholder="e.g., PL-ABC123-XYZ456"
                                    value={reference}
                                    onChange={(e) => {
                                        setReference(e.target.value);
                                        setError("");
                                    }}
                                    error={error}
                                    className="w-full text-lg"
                                    leftIcon={<MagnifyingGlassIcon size={20} />}
                                />
                            </div>
                            {!error && (
                                <p className="text-xs text-gray-500">
                                    Your payment reference should look like PL-XXXX-YYYY
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full text-lg py-4"
                        >
                            Find Payment Link
                        </Button>
                    </form>

                    {/* Info Section */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">
                            Where can I find my payment reference?
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Check your email for the payment request</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Look for the reference code in your invoice</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Contact the merchant who sent you the payment link</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">
                        Need help? <a href="mailto:support@unilinks.com" className="text-primary hover:underline">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PayLookupPage;
