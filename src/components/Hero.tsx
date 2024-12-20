import { motion } from "framer-motion";
import { useEffect } from "react";

export const Hero = () => {
  useEffect(() => {
    const img = new Image();
    img.src = "lovable-uploads/be0bef3c-0975-405c-b967-8e5962c22b85.png";
    img.onload = () => console.log("Image loaded successfully");
    img.onerror = (e) => console.error("Error loading image:", e);
  }, []);

  return (
    <section className="h-screen relative">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source
          src="https://djepidemik.com/wp-content/uploads/2024/10/hero-video.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      
      {/* Continue Button */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <button 
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="bg-primary text-black font-noto font-bold hover:bg-primary/80 px-8 py-3 rounded-full text-lg transition-colors animate-float"
        >
          Continue to Site
        </button>
      </div>
    </section>
  );
};