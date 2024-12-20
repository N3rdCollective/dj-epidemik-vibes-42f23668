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
import { toast } from "sonner";

interface Package {
  name: string;
  price: number;
  description: string;
}

interface EventCardProps {
  date: string;
  venue: string;
  location: string;
  time: string;
  type: "packages" | "rsvp";
  packages?: Package[];
  icalLink: string;
  selectedPackage: string;
  setSelectedPackage: (value: string) => void;
  isCameloEvent?: boolean;
}

export const EventCard = ({
  date,
  venue,
  location,
  time,
  type,
  packages,
  icalLink,
  selectedPackage,
  setSelectedPackage,
  isCameloEvent = false,
}: EventCardProps) => {
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

  const handleAddToCalendar = (icalLink: string, eventName: string) => {
    window.open(icalLink, '_blank');
    toast.success(`Added ${eventName} to your calendar!`);
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-3xl font-bold text-primary animate-float">
          {date}
        </div>
        <div className="text-center md:text-left flex-1">
          <h3 className="text-2xl font-semibold text-white mb-1">{venue}</h3>
          <p className="text-gray-400">{location}</p>
        </div>
        <div className="text-gray-300 font-medium whitespace-nowrap">
          {time}
        </div>
        <div className="flex gap-2">
          {!isCameloEvent && (
            type === "packages" ? (
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
                  <div className="grid gap-4 py-4">
                    <RadioGroup
                      value={selectedPackage}
                      onValueChange={setSelectedPackage}
                    >
                      {packages?.map((pkg, idx) => (
                        <div key={idx} className="flex flex-col space-y-2 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={pkg.name} id={`${pkg.name}-${idx}`} />
                            <Label htmlFor={`${pkg.name}-${idx}`} className="flex justify-between w-full">
                              <span>{pkg.name}</span>
                              <span className="text-primary font-bold">${pkg.price}</span>
                            </Label>
                          </div>
                          <p className="text-sm text-gray-500 ml-6">{pkg.description}</p>
                        </div>
                      ))}
                    </RadioGroup>
                    <Button 
                      onClick={() => handleTicketPurchase(venue)}
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
            )
          )}
          <Button
            onClick={() => handleAddToCalendar(icalLink, venue)}
            variant="outline"
            className="px-4 whitespace-nowrap"
          >
            Add to Calendar
          </Button>
        </div>
      </div>
    </div>
  );
};