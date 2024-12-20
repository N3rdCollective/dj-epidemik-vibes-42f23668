import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { EventDateTime } from "./event/EventDateTime";
import { EventVenue } from "./event/EventVenue";
import { EventActions } from "./event/EventActions";
import { RsvpForm } from "./event/RsvpForm";
import { PackageSelector } from "./event/PackageSelector";

interface Package {
  name: string;
  price: number;
  description: string;
}

interface EventCardProps {
  id: string;
  date: string;
  venue: string;
  location: string;
  time: string;
  type: "packages" | "rsvp";
  packages?: Package[];
  selectedPackage: string;
  setSelectedPackage: (value: string) => void;
  isCameloEvent?: boolean;
}

export const EventCard = ({
  id,
  date,
  venue,
  location,
  time,
  type,
  packages,
  selectedPackage,
  setSelectedPackage,
  isCameloEvent = false,
}: EventCardProps) => {
  const [isRsvpDialogOpen, setIsRsvpDialogOpen] = useState(false);

  const handleTicketPurchase = (eventName: string) => {
    if (!selectedPackage) {
      toast.error("Please select a ticket package");
      return;
    }
    toast.success(`Ticket purchase initiated for ${eventName} - ${selectedPackage}`);
    setSelectedPackage("");
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-3xl font-bold text-primary animate-float">
          {date}
        </div>
        
        <EventVenue venue={venue} location={location} />
        <EventDateTime time={time} />
        
        <EventActions
          type={type}
          isCameloEvent={isCameloEvent}
          venue={venue}
        >
          {type === "packages" ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary text-black hover:bg-primary/80 font-bold px-8">
                  Get Tickets
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Select Ticket Package</DialogTitle>
                  <DialogDescription>
                    Choose your preferred ticket package for {venue}
                  </DialogDescription>
                </DialogHeader>
                <PackageSelector
                  packages={packages}
                  selectedPackage={selectedPackage}
                  setSelectedPackage={setSelectedPackage}
                  onPurchase={() => handleTicketPurchase(venue)}
                />
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={isRsvpDialogOpen} onOpenChange={setIsRsvpDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-black hover:bg-primary/80 font-bold px-8">
                  RSVP Now
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>RSVP for {venue}</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to reserve your spot
                  </DialogDescription>
                </DialogHeader>
                <RsvpForm eventId={id} onSuccess={() => setIsRsvpDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
        </EventActions>
      </div>
    </div>
  );
};