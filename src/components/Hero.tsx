import React from "react";
import epidemikLogo from "/dj-epidemik-logo.png";

export const Hero = () => {
  return (
    <>
      {/* Video Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source
            src="https://res.cloudinary.com/dfyqx7vcu/video/upload/v1711386814/epidemik-video_yvbxvp.mp4"
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

      {/* Content Section Below Video */}
      <section className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/lovable-uploads/a2ad1e2b-a00b-48a1-8d6a-32466d496329.png")' }}>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <img
            src={epidemikLogo}
            alt="DJ Epidemik Logo"
            className="w-full max-w-xl mx-auto px-4 animate-float"
          />
        </div>
      </section>
    </>
  );
};