import { CurrencyCircleDollarIcon, ChartLineUpIcon, ShareNetworkIcon } from "@phosphor-icons/react";
import Button from "../../../components/button/Button";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer/Footer";

export default function Homepage() {
  const { user } = useContext(AuthContext);

  return (
    <main className="bg-[url('/bg.svg')] bg-cover bg-top min-h-screen flex flex-col">
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

      <section className="flex flex-col sm:items-center 2xl:gap-8 md:gap-6 gap-4 2xl:p-12 md:p-10 p-4 py-24">
        <h2 className="md:text-[48px] text-[40px] max-w-2xl leading-[120%] font-semibold sm:text-center">
          Create Payment Links That Convert in Seconds
        </h2>

        <p className="sm:text-center max-w-2xl leading-[24px] mb-4">
          The modern payment link generator for freelancers, businesses, and creators. Accept payments via crypto, bank transfer, PayPal, and Stripe with custom branded links. Get paid faster with real-time tracking and instant notifications.
        </p>

        <Button className="z-2" href="/auth/login">Get Started for free</Button>
      </section>

      <div className="p-4 mb-6">
        <img src="/hero-bg.png" alt="UniLinks app mockup" width={1920} height={1080} className="md:w-[75%] w-full h-auto mt-auto mx-auto" />
      </div>

      <section className="flex flex-col gap-10 lg:p-[6%] md:p-[3%] p-4 md:mx-[5%] mb-12 md:shadow-lg rounded-[12px] bg-white">
        <div className="grid md:grid-cols-2 items-center gap-[60px]">
          <div className="flex flex-col gap-4">
            <p className="font-medium text-primary uppercase">Enterprise-Grade Security</p>
            <h2 className="text-[42px] font-medium leading-[110%]">Built to Scale with Your Success</h2>
          </div>
          <div className="flex items-center md:justify-center">
            <p className="md:w-[75%]">
              From solo entrepreneurs to growing enterprises, UniLinks adapts to your payment needs. Our infrastructure handles everything from a single transaction to thousands per day, with bank-level security and 99.9% uptime guaranteed.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 items-center gap-[60px]">
          <div className="flex flex-col gap-4">
            <p className="md:text-[40px] text-[32px] text-primary"><CurrencyCircleDollarIcon /></p>
            <h2 className="font-medium">Accept Any Payment Method</h2>
            <p className="">Never lose a sale again. Support for bank transfers, Bitcoin, Ethereum, PayPal, Stripe, and 5+ payment gateways. Your customers pay how they want, you get paid instantly.</p>
          </div>
          <div className="flex flex-col gap-4">
            <p className="md:text-[40px] text-[32px] text-primary"><ChartLineUpIcon /></p>
            <h2 className="font-medium">Live Payment Analytics</h2>
            <p className="">Know exactly when you're getting paid. Monitor every transaction with detailed activity timelines, automatic expiration tracking, and instant payment confirmations delivered to your dashboard.</p>
          </div>
          <div className="flex flex-col gap-4">
            <p className="md:text-[40px] text-[32px] text-primary"><ShareNetworkIcon /></p>
            <h2 className="font-medium">Share Links Anywhere</h2>
            <p className="">One link, unlimited reach. Generate secure payment URLs in 3 seconds. Share via WhatsApp, email, Instagram, or embed on your website. QR codes included for in-person payments.</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-10 lg:p-[6%] md:p-[3%] p-4 mb-12">
          <div className="flex flex-col justify-center md:items-center gap-4 mb-10">
            <p className="font-medium text-primary uppercase">Trusted by Thousands</p>
            <h2 className="text-[42px] font-medium leading-[110%]">Why Businesses Choose UniLinks</h2>
          </div>

          <div className="flex md:flex-nowrap flex-wrap gap-[32px]">
            <div className="flex flex-col md:w-[50%] w-full gap-4 bg-primary/[0.08] rounded-lg p-6">
              <h3 className="font-medium text-[80px] font-semibold">5+</h3>
              <p>Integrated payment gateways including crypto, cards, and bank transfers</p>
            </div>
            <div className="flex flex-col justify-between md:w-[50%] w-full gap-4 bg-primary/[0.08] rounded-lg p-6">
              <h3 className="font-semibold text-lg">Bank-Level Security</h3>
              <p>Your transactions are protected with AES-256 encryption, secure Firebase authentication, and automated fraud detection. We never store sensitive payment credentials.</p>
            </div>
          </div>
          <div className="flex md:flex-nowrap flex-wrap w-full gap-4 bg-primary/[0.08] rounded-lg p-6 h-[400px]">
            <div className="flex flex-col justify-center gap-8 md:w-[30%]">
              <h3 className="font-semibold text-lg">Complete Payment Visibility</h3>
              <p>Professional dashboard with comprehensive analytics. Track payment status, view transaction history, manage expiration dates, and receive instant notifications the moment you get paid.</p>
            </div>
          </div>
      </section>

      <section className="flex flex-col items-center justify-center gap-10 lg:p-[6%] p-[10%] sm:mx-[6%] mx-4 mb-12 rounded-[12px] bg-primary text-white">
        <div className="">
          <h2 className="md:text-[42px] text-[32px] font-medium leading-[110%] text-center">Ready to Get Started?</h2>
        </div>
        <div>
          <Button variant="secondary" className="z-2" href="/auth/login">Create Your Free Account</Button>
        </div>      
      </section>

      <Footer />
    </main>
  );
}
