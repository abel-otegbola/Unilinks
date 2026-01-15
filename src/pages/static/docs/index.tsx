import { Link } from "react-router-dom";
import { BookOpenIcon, LinkIcon, CreditCardIcon, QrCodeIcon, ChartBarIcon } from "@phosphor-icons/react";
import Button from "../../../components/button/Button";
import { AuthContext } from "../../../contexts/AuthContext";
import { useContext, useState, useEffect, useMemo } from "react";

function DocsPage() {
  const { user } = useContext(AuthContext);
    const isOpen = true; // Sidebar is always open on docs page
    const [ currentPath, setCurrentPath ] = useState("getting-started");

    const navBarLinks = useMemo(() => [
        { name: "Getting Started", href: "getting-started", icon: <LinkIcon /> },
        { name: "Payment Methods", href: "payment-methods", icon: <CreditCardIcon /> },
        { name: "Payment Links", href: "payment-links", icon: <QrCodeIcon /> },
        { name: "Dashboard", href: "dashboard", icon: <ChartBarIcon /> },
        { name: "FAQ", href: "faq", icon: <BookOpenIcon /> },
    ], []);

    // Smooth scroll to section
    const handleNavClick = (href: string) => {
        const element = document.getElementById(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setCurrentPath(href);
        }
    };

    // Track scroll position and update active section
    useEffect(() => {
        const sections = navBarLinks.map(link => document.getElementById(link.href));
        
        const observerOptions = {
            root: null,
            rootMargin: '-100px 0px -66%',
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setCurrentPath(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach(section => {
            if (section) observer.observe(section);
        });

        return () => {
            sections.forEach(section => {
                if (section) observer.unobserve(section);
            });
        };
    }, [navBarLinks]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center lg:px-[6%] md:px-[3%] p-4">
        <img src="/logo.svg" alt="UniLinks logo" width={64} height={32} className="sm:ml-0 ml-1" />

        {user ? (
        <Link to="/account">
            <img src="/profile.jpg" alt="Profile" className="w-10 h-10 rounded-full shadow border border-white outline outline-primary/[0.2] outline-offset-2" />
        </Link>
        ) : (
        <Button variant="secondary" size="small" href="/auth/login" className="">Login</Button>
        )}
    </header>

    <div className="flex sm:flex-row flex-col gap-6 lg:px-[5%] md:px-[3%] p-4">
        <aside
            className={`fixed lg:sticky top-4 md:bg-none h-[calc(100vh-100px)] bg-gray-50 p-2 inset-y-0 rounded-[12px] left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out ${
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
            >
            <nav className="space-y-1">
                {
                navBarLinks.map((link) => (
                    <button
                        key={link.href}
                        onClick={() => handleNavClick(link.href)}
                        className={`flex items-center gap-3 px-3 py-3 text-[14px] rounded-lg font-medium transition-colors w-full text-left ${
                            currentPath === link.href
                            ? "bg-white opacity-100 border border-gray-500/[0.1]"
                            : "opacity-[0.5] hover:bg-gray-100"
                        }`}
                    >
                        <span className="text-xl">{link.icon}</span>
                        <span className="leading-0">{link.name}</span>
                    </button>
                ))
                }
            </nav>
        </aside>
        <div className="sm:w-3/4 w-full p-6">
        {/* Hero Section */}
            <section className="py-12">
                <div className="">
                <div className="flex items-center gap-3 mb-4">
                    <BookOpenIcon size={32} className="text-primary" />
                    <h1 className="text-4xl font-bold">Documentation</h1>
                </div>
                <p className="text-lg text-gray-600">
                    Everything you need to know about creating and managing payment links with UniLinks
                </p>
                </div>
            </section>

            {/* Main Content */}
            <main className=" py-12">
                <div className="flex flex-col gap-8">
                {/* Getting Started */}
                <div id="getting-started" className="bg-white border-t border-gray-500/[0.2] py-8 scroll-mt-20">
                    <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <LinkIcon size={24} className="text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold">Getting Started</h2>
                    </div>
                    <div className="space-y-4 text-gray-600 flex flex-col gap-4">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">1. Create an Account</h3>
                        <p>Sign up with your email and password to access your dashboard.</p>
                        <img src="/docs/sign-in-mockup.png" alt="Sign In Mockup" className="mt-4 border border-gray-500/[0.1] rounded-lg shadow-md" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">2. Add Payment Methods</h3>
                        <p>Set up your payment methods (Bank, Crypto, PayPal, Stripe) to receive payments.</p>
                        <img src="/docs/payment-methods-mockup.png" alt="Payment Methods Mockup" className="mt-4 border border-gray-500/[0.1] rounded-lg shadow-md" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">3. Create Payment Links</h3>
                        <p>Generate unique payment links with custom amounts and expiry dates.</p>
                        <img src="/docs/create-link-mockup.png" alt="Create Link Mockup" className="mt-4 border border-gray-500/[0.1] rounded-lg shadow-md" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">4. Share & Get Paid</h3>
                        <p>Share your payment links via URL or QR code and track payments in real-time.</p>
                        <img src="/docs/share-link-mockup.png" alt="Share Link Mockup" className="mt-4 border border-gray-500/[0.1] rounded-lg shadow-md" />
                    </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div id="payment-methods" className="bg-white border-t border-gray-500/[0.2] py-8 scroll-mt-20">
                    <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <CreditCardIcon size={24} className="text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-semibold">Payment Methods</h2>
                    </div>
                    <div className="space-y-4 text-gray-600 flex flex-col gap-4">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Bank Transfer</h3>
                        <p>Add your bank account details including account number, holder name, and routing information.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Cryptocurrency</h3>
                        <p>Support for Bitcoin, Ethereum, USDT, USDC, and other popular cryptocurrencies. Connect your wallet or enter manually.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">PayPal</h3>
                        <p>Link your PayPal account with email, account type, and regional settings.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Stripe</h3>
                        <p>Configure Stripe payment processing with account ID and display preferences.</p>
                    </div>
                    </div>
                </div>

                {/* Payment Links */}
                <div id="payment-links" className="bg-white border-t border-gray-500/[0.2] py-8 scroll-mt-20">
                    <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                        <QrCodeIcon size={24} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold">Payment Links</h2>
                    </div>
                    <div className="space-y-4 text-gray-600 flex flex-col gap-4">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Create a Link</h3>
                        <p>Set amount, currency, expiration date, and select payment methods. Add optional notes for reference.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Share Options</h3>
                        <p>Copy the unique URL, download QR code as PDF, or share directly with customers.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Link Status</h3>
                        <p>Monitor link status: Active, Pending, Completed, Expired, or Cancelled. View live countdown timer.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Payment Tracking</h3>
                        <p>Track timeline events, view payment proofs, and mark payments as complete.</p>
                    </div>
                    </div>
                </div>

                {/* Dashboard */}
                <div id="dashboard" className="bg-white border-t border-gray-500/[0.2] py-8 scroll-mt-20">
                    <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <ChartBarIcon size={24} className="text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-semibold">Dashboard</h2>
                    </div>
                    <img src="/docs/dashboard-mockup.png" alt="Dashboard Mockup" className="mt-4 border border-gray-500/[0.1] rounded-lg shadow-md" />
                    <div className="space-y-4 text-gray-600 flex flex-col gap-4 py-4">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Overview</h3>
                        <p>View total links, active links, expired links, and total revenue from completed payments.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Recent Activity</h3>
                        <p>Quick access to your recent payment links and their current status.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Payment Methods</h3>
                        <p>Manage all your configured payment methods from one place.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
                        <p>Track completion rates and monitor payment link performance.</p>
                    </div>
                    </div>
                </div>
                </div>

                {/* FAQ Section */}
                <div id="faq" className="mt-12 bg-white border-t border-gray-500/[0.2] py-8 scroll-mt-20">
                    <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-1 flex flex-col border border-gray-500/[0.1] bg-gray-50 rounded-[12px] p-1">
                        <div className="p-4 rounded-lg bg-white border border-gray-500/[0.1]">
                            <h3 className="font-semibold mb-2">How do payment links work?</h3>
                            <p className="text-gray-600">
                                You create a payment link with a specific amount and share it with your customer. When they visit the link, 
                                they can see your payment methods and make the payment. You can then track and confirm payments through your dashboard.
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-white border border-gray-500/[0.1]">
                            <h3 className="font-semibold mb-2">Can I edit a payment link after creation?</h3>
                            <p className="text-gray-600">
                                Yes, you can edit payment links as long as they haven't been completed or cancelled. You can update the amount, 
                                expiry date, notes, and payment methods.
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-white border border-gray-500/[0.1]">
                            <h3 className="font-semibold mb-2">What happens when a link expires?</h3>
                            <p className="text-gray-600">
                                Expired links are automatically marked as expired and can no longer be used for payments. The system checks 
                                expiration when the link is opened and updates the status accordingly.
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-white border border-gray-500/[0.1]">
                            <h3 className="font-semibold mb-2">Is UniLinks free to use?</h3>
                            <p className="text-gray-600">
                                Yes, UniLinks is currently free to use. You can create unlimited payment links and add unlimited payment methods.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="flex flex-col items-center justify-center mt-12 bg-primary/5 rounded-lg p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
                    <p className="text-gray-600 mb-6">
                        Create your account and start accepting payments in minutes
                    </p>
                    <Button href="/auth/register" size="large">
                        Create Free Account
                    </Button>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-12">
                <div className=" py-6 text-center text-gray-600">
                <p>&copy; 2026 UniLinks. All rights reserved.</p>
                </div>
            </footer>
        </div>
    </div>

     
    </div>
  );
}

export default DocsPage;
