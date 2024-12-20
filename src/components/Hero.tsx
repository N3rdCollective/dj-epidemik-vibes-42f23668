import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="min-h-screen relative flex items-center justify-center bg-[#0A0A0A] overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-50"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-dj-playing-music-at-a-concert-814-large.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-[#0A0A0A] z-[1]" />
      
      {/* Content */}
      <div className="container mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
            DJ EPIDEMIK
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Experience the Epidemic of Sound
          </p>
          <button className="bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-full text-lg transition-colors">
            Book Now
          </button>
        </motion.div>
      </div>
    </section>
  );
};