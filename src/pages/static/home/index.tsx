import { CurrencyCircleDollarIcon, ChartLineUpIcon, ShareNetworkIcon } from "@phosphor-icons/react";
import Button from "../../../components/button/Button";

export default function Homepage() {
  return (
    <main className="bg-[url('/bg.svg')] bg-cover bg-top min-h-screen flex flex-col">
      <header className="flex justify-between 2xl:p-8 md:p-6 p-4 items-center">
        <img src="/logo.svg" alt="UniLinks logo" width={64} height={32} />

        <Button variant="secondary" href="/auth/login">Login</Button>
      </header>

      <section className="flex flex-col sm:items-center 2xl:gap-8 md:gap-6 gap-4 2xl:p-12 md:p-10 p-4 py-24">
        <h2 className="text-[48px] max-w-2xl leading-[120%] font-semibold sm:text-center">
          Universal Payment Link Generator
        </h2>

        <p className="sm:text-center max-w-2xl leading-[24px] mb-4">
          Generate professional payment links in seconds. Set your amount, choose your payment method, and share. Track activity and get paid faster across multiple currencies.
        </p>

        <Button className="z-2" href="/auth/login">Get Started for free</Button>
      </section>

      <div className="p-4 mb-6">
        <img src="/hero-bg.png" alt="UniLinks app mockup" width={1920} height={1080} className="md:w-[75%] w-full h-auto mt-auto mx-auto" />
      </div>

      <section className="flex flex-col gap-10 lg:p-[6%] md:p-[3%] p-4 md:mx-[5%] mb-12 md:shadow-lg rounded-[12px] bg-white">
        <div className="grid md:grid-cols-2 items-center gap-[60px]">
          <div className="flex flex-col gap-4">
            <p className="font-medium text-primary uppercase">Secure payment</p>
            <h2 className="text-[42px] font-medium leading-[110%]">Experience that grows with your business</h2>
          </div>
          <div className="flex items-center md:justify-center">
            <p className="md:w-[75%]">
              Our platform is built with scalability in mind, ensuring that as your business expands, our services adapt to meet your evolving payment needs seamlessly.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 items-center gap-[60px]">
          <div className="flex flex-col gap-4">
            <p className="md:text-[40px] text-[32px] text-primary"><CurrencyCircleDollarIcon /></p>
            <h2 className="font-medium">Multiple Payment Methods</h2>
            <p className="">Support for bank transfers, cryptocurrency, PayPal, Stripe, and more. Accept payments through your preferred channels.</p>
          </div>
          <div className="flex flex-col gap-4">
            <p className="md:text-[40px] text-[32px] text-primary"><ChartLineUpIcon /></p>
            <h2 className="font-medium">Real-Time Tracking</h2>
            <p className="">Track payment activity with detailed timelines. Monitor link status, expiration dates, and payment completion in real-time.</p>
          </div>
          <div className="flex flex-col gap-4">
            <p className="md:text-[40px] text-[32px] text-primary"><ShareNetworkIcon /></p>
            <h2 className="font-medium">Easy Sharing</h2>
            <p className="">Generate unique payment links in seconds. Copy and share via email, social media, or any messaging platform with one click.</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-10 lg:p-[6%] md:p-[3%] p-4 mb-12">
          <div className="flex flex-col justify-center items-center gap-4 mb-10">
            <p className="font-medium text-primary uppercase">Why us</p>
            <h2 className="text-[42px] font-medium leading-[110%]">Why they prefer Unilinks</h2>
          </div>

          <div className="flex md:flex-nowrap flex-wrap gap-[32px]">
            <div className="flex flex-col md:w-[50%] w-full gap-4 bg-primary/[0.08] rounded-lg p-6">
              <h3 className="font-medium text-[80px] font-semibold">5+</h3>
              <p>Payment gateways you can choose from</p>
            </div>
            <div className="flex flex-col justify-between md:w-[50%] w-full gap-4 bg-primary/[0.08] rounded-lg p-6">
              <h3 className="font-semibold text-lg">Robust Security</h3>
              <p>We prioritize your security with advanced encryption and compliance measures to protect your transactions and data.</p>
            </div>
          </div>
          <div className="flex md:flex-nowrap flex-wrap w-full gap-4 bg-primary/[0.08] rounded-lg p-6 h-[400px]">
            <div className="flex flex-col justify-center gap-8 md:w-[30%]">
              <h3 className="font-semibold text-lg">Real-Time Analytics</h3>
              <p>Track all your payment links with comprehensive dashboards, activity timelines, and instant notifications for every transaction.</p>
            </div>
          </div>
      </section>
    </main>
  );
}
