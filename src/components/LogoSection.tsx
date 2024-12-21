import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RsvpForm } from "./event/RsvpForm";
import { useState } from "react";

export const LogoSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleBookingSuccess = () => {
    setIsDialogOpen(false);
  };

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
          filter: 'brightness(0.3)',
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
            The voice of the underground
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="bg-primary text-black font-noto font-bold hover:bg-primary/80 px-8 py-3 rounded-full text-lg transition-colors">
                Book Now
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Book DJ EPIDEMIK</DialogTitle>
              </DialogHeader>
              <RsvpForm 
                eventId="booking-request" 
                onSuccess={handleBookingSuccess}
              />
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </section>
  );
};