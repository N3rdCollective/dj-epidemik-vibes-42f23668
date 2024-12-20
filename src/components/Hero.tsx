import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="min-h-screen relative flex items-center justify-center bg-[#0A0A0A] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent" />
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