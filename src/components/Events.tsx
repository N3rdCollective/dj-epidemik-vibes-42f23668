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
import { useState } from "react";
import { toast } from "sonner";

export const Events = () => {
  const events = [
    {
      date: "MAR 15",
      venue: "Club Nova",
      location: "Los Angeles, CA",
      time: "10 PM - 2 AM",
      type: "packages",
      packages: [
        { name: "General Admission", price: 30 },
        { name: "VIP Access", price: 75 },
        { name: "VIP Table Service", price: 300 },
      ],
    },
    {
      date: "MAR 22",
      venue: "Electric Festival",
      location: "Miami, FL",
      time: "9 PM - 1 AM",
      type: "packages",
      packages: [
        { name: "Early Bird", price: 45 },
        { name: "Regular Admission", price: 60 },
        { name: "VIP Experience", price: 120 },
      ],
    },
    {
      date: "APR 05",
      venue: "The Underground",
      location: "New York, NY",
      time: "11 PM - 4 AM",
      type: "rsvp",
    },
  ];

  const [selectedPackage, setSelectedPackage] = useState("");

  const handleRSVP = () => {
    toast.success("RSVP Confirmed! See you at the event!");
  };

  const handleTicketPurchase = (eventName: string) => {
    if (!selectedPackage) {
      toast.error("Please select a ticket package");
      return;
    }
    toast.success(`Ticket purchase initiated for ${eventName} - ${selectedPackage}`);
    setSelectedPackage("");
  };

  return (
    <section className="py-20 bg-[#0A0A0A]" id="events">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Upcoming Events
        </h2>
        <div className="max-w-4xl mx-auto space-y-6">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-3xl font-bold text-primary animate-float">
                  {event.date}
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-semibold text-white mb-1">{event.venue}</h3>
                  <p className="text-gray-400">{event.location}</p>
                </div>
                <div className="text-gray-300 font-medium">{event.time}</div>
                
                {event.type === "packages" ? (
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
                          Choose your preferred ticket package for {event.venue}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <RadioGroup
                          value={selectedPackage}
                          onValueChange={setSelectedPackage}
                        >
                          {event.packages?.map((pkg, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <RadioGroupItem value={pkg.name} id={`${pkg.name}-${idx}`} />
                              <Label htmlFor={`${pkg.name}-${idx}`} className="flex justify-between w-full">
                                <span>{pkg.name}</span>
                                <span className="text-primary font-bold">${pkg.price}</span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        <Button 
                          onClick={() => handleTicketPurchase(event.venue)}
                          className="w-full mt-4"
                        >
                          Purchase Tickets
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button 
                    onClick={handleRSVP}
                    className="bg-primary text-black hover:bg-primary/80 font-bold px-8"
                  >
                    RSVP Now
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};