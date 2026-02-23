import { useEffect, useState } from "react";
import Slider from "../slider/slider";

const slides = [
  {
    title: "Generate Payment Links in Seconds",
    text: "Create secure, shareable payment links instantly. Accept payments via bank transfers or cryptocurrency from anywhere in the world.",
    img: "/auth-bg.png",
  },
  {
    title: "Set Expiration Times for Security",
    text: "Control your payment links with custom expiration times. Keep your transactions secure and manage payment windows with ease.",
    img: "/auth-bg.png",
  },
  {
    title: "Global Commerce Made Simple",
    text: "Streamline your journey from invoice to settlement. Support both traditional and crypto payments, perfect for freelancers and businesses worldwide.",
    img: "/auth-bg.png",
  },
];

function AuthOverlay() {
  const [activeSlider, setActiveSlider] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSlider((prev) => (prev === slides.length -1 ? 0 : prev + 1));
    }, 5000);
    return () => clearTimeout(timer);
  }, [activeSlider]);

  return (
    <div className="h-screen sticky top-0 bg-[url('/auth-bg.png')] bg-cover 2xl:w-[35%] xl:w-[30%] md:w-[35%] md:block hidden relative">

      {/* Content Overlay */}
      <div className="relative flex flex-col h-full justify-end gap-6 w-full">

        <div className="bg-gradient-to-b via-black/[0.6] to-black px-[12%] pb-[5%] pt-[28%]">
          <div className="relative h-[170px] min-[1920px]:h-[140px] overflow-hidden">
            <div
              className="flex relative h-full text-white"
            >
              <Slider slides={slides} activeSlider={activeSlider} />
            </div>
          </div>

          {/* Dots */}
          <div className="flex items-start gap-3">
            {slides.map((_, i) => (
              <button onClick={() => setActiveSlider(i)}
                key={i}
                className={`cursor-pointer duration-500 rounded-lg ${activeSlider === i ? "w-8 h-[6px] bg-secondary" : "w-5 h-[6px] bg-gray-100"}`}
              ></button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AuthOverlay;
