import { CurrencyCircleDollarIcon, ChartLineUpIcon, ShareNetworkIcon } from "@phosphor-icons/react";
import Button from "../../../components/button/Button";
import Footer from "../../../components/footer/Footer";
import Topbar from "../../../components/topbar/topbar";

export default function Homepage() {

  return (
    <main className="bg-[url('/bg.svg')] bg-cover bg-top min-h-screen flex flex-col">
      <Topbar />

      <section className="flex md:flex-row flex-col sm:items-start 2xl:gap-8 md:gap-6 gap-4 md:px-[6%] p-4 md:py-10 py-4 bg-primary/[0.01] pb-24">
        <div className="flex flex-col md:gap-4 gap-2 md:w-[40%] w-full py-6">
          <h2 className="md:text-[52px] sm:text-[40px] text-[32px] max-w-2xl leading-[120%] font-semibold">
            Get Paid Anywhere With One Secure Link
          </h2>

          <p className="max-w-2xl leading-[24px] md:mb-4 mb-2">
            Create a single payment link your clients can trust. Accept multiple payment methods, track payments in real time, and receive instant confirmations—all from one clean, secure dashboard.
          </p>

          <Button className="z-2" href="/auth/login">Get Started for free</Button>
          <img src="/users.png" alt="UniLinks app mockup" width={174} height={54} className="md:mt-8 mt-4" />

        </div>

        <div className="p-4 md:w-[60%] w-full">
          <img src="/hero-bg.png" alt="UniLinks app mockup" width={1920} height={1080} className="md:w-[75%] w-full h-auto mt-auto mx-auto" />
        </div>

      </section>



      <section className="flex flex-col gap-10 lg:p-[6%] md:p-[3%] p-4 md:mx-[5%] mb-12 md:shadow-lg rounded-[12px] bg-white -mt-12">
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
          <div className="relative flex md:flex-nowrap flex-wrap w-full gap-8 bg-primary/[0.08] rounded-lg p-6 pb-0 md:h-[400px]">
            <div className="flex flex-col justify-center gap-8 md:w-[30%]">
              <h3 className="font-semibold text-lg">Complete Payment Visibility</h3>
              <p>Professional dashboard with comprehensive analytics. Track payment status, view transaction history, manage expiration dates, and receive instant notifications the moment you get paid.</p>
            </div>
            <div className=" flex-1 flex items-end h-full justify-center">
              <img src="/why-bg.png" width={500} height={300} className="object-cover md:w-[500px] w-full" />
              <div className="absolute bottom-0 left-0 w-full h-[90px] bg-gradient-to-t from-primary/[0.1] via-primary/[0.08] rounded-b-lg"></div>
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
