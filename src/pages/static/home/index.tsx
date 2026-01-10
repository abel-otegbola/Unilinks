import Button from "../../../components/button/Button";

export default function Homepage() {
  return (
    <main className="bg-[url('/bg.svg')] bg-cover bg-top min-h-screen flex flex-col">
      <header className="flex justify-between 2xl:p-8 md:p-6 p-4 items-center">
        <img src="/logo.svg" alt="UniLinks logo" width={120} height={40} />

        <Button variant="secondary" href="/auth/login">Login</Button>
      </header>

      <section className="flex flex-col items-center 2xl:gap-8 md:gap-6 gap-4 2xl:p-12 md:p-10 p-6">
        <h2 className="2xl:text-[48px] md:text-[40px] text-[32px] max-w-2xl md:leading-[40px] leading-[40px] font-semibold text-center">
          Universal Payment Link Generator
        </h2>

        <p className="text-center max-w-2xl leading-[24px] mb-4">
          Create and share professional payment links instantly with ease. No technical skills required—just set your amount, choose your payment method, and generate a shareable link. Our intelligent platform helps you manage payments, track activity, and get paid faster across multiple currencies and payment methods.
        </p>

        <div className="relative">
          <div className="absolute dark:top-[5%] top-[5%] left-[1%] w-[98%] dark:h-[90%] h-[90%] z-[-1] btn-bg p-2 backdrop-blur-[15px] rounded-[12px] bg-opacity-80 ">
          </div>
          <Button className="z-2" href="/auth/login">Get Started for free</Button>
        </div>
      </section>

      <div className="p-4">
        <img src="/hero-bg.png" alt="UniLinks app mockup" width={1920} height={1080} className="md:w-[75%] w-full h-auto mt-auto mx-auto" />
      </div>
    </main>
  );
}
