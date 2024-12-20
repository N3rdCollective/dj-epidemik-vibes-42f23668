import { motion } from "framer-motion";

export const LogoSection = () => {
  return (
    <section className="py-20 relative logo-section">
      {/* Background image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('lovable-uploads/59295d77-963d-400f-9d68-d5426921442d.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.3)', // Changed from 0.5 to 0.3 to make the overlay darker
        }}
      />
      
      {/* Content overlay */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <img 
            src="lovable-uploads/be0bef3c-0975-405c-b967-8e5962c22b85.png" 
            alt="DJ EPIDEMIK"
            className="w-[500px] md:w-[700px] mx-auto mb-6 filter brightness-200"
            onError={(e) => console.error("Image failed to load:", e)}
          />
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Experience the Epidemic of Sound
          </p>
          <button className="bg-primary text-black font-noto font-bold hover:bg-primary/80 px-8 py-3 rounded-full text-lg transition-colors">
            Book Now
          </button>
        </motion.div>
      </div>
    </section>
  );
};