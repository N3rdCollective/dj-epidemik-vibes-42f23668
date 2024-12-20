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
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseICalEvents } from "@/utils/icalParser";

const ICAL_URL = "https://api.camelohq.com/ical/0951e7cf-629b-4dbf-b08a-263cf483e740?smso=true&token=b1V4c2N4ck9RODAxWmZ6Q25MWT0tLXJ0c2dleFRqM3hjWSs5bDItLUpmd00wYS9hRzBMTEFQVDZTU0hoeHc9PQ%3D%3D&wid=6f6f1fb7-7065-4d7b-b965-9d2fc0f23674";

interface ICalEvent {
  date: string;
  venue: string;
  location: string;
  time: string;
  type: "packages" | "rsvp";
  packages?: {
    name: string;
    price: number;
    description: string;
  }[];
  icalLink: string;
}

export const Events = () => {
  const [selectedPackage, setSelectedPackage] = useState("");
  const [events, setEvents] = useState<ICalEvent[]>([]);

  const { data: icalData, isLoading, error } = useQuery({
    queryKey: ['ical-events'],
    queryFn: async () => {
      console.log('Fetching iCal data...');
      const response = await axios.get(ICAL_URL);
      console.log('iCal response:', response.data);
      return response.data;
    },
  });

  useEffect(() => {
    if (icalData) {
      console.log('Processing iCal data...');
      try {
        const parsedEvents = parseICalEvents(icalData, ICAL_URL);
        console.log('Parsed events:', parsedEvents);
        if (parsedEvents.length > 0) {
          setEvents(parsedEvents);
        }
      } catch (error) {
        console.error('Error parsing iCal data:', error);
        toast.error('Failed to load calendar events');
      }
    }
  }, [icalData]);

  const defaultEvents: ICalEvent[] = [
    {
      date: "MAR 15",
      venue: "Club Nova",
      location: "Los Angeles, CA",
      time: "10 PM - 2 AM",
      type: "packages",
      packages: [
        { 
          name: "General Admission", 
          price: 30,
          description: "Basic entry to the event with access to main dance floor and bar areas."
        },
        { 
          name: "VIP Access", 
          price: 75,
          description: "Premium entry with access to VIP lounge, complimentary welcome drink, and priority entry."
        },
        { 
          name: "VIP Table Service", 
          price: 300,
          description: "Exclusive table service for up to 6 people, includes 2 premium bottles, dedicated server, and best view of the stage."
        },
      ],
      icalLink: ICAL_URL
    },
    {
      date: "MAR 22",
      venue: "Electric Festival",
      location: "Miami, FL",
      time: "9 PM - 1 AM",
      type: "packages",
      packages: [
        { 
          name: "Early Bird", 
          price: 45,
          description: "Limited early access tickets at a special rate. Includes festival entry and access to all main stages."
        },
        { 
          name: "Regular Admission", 
          price: 60,
          description: "Standard festival entry with access to all stages and general amenities."
        },
        { 
          name: "VIP Experience", 
          price: 120,
          description: "Enhanced festival experience with VIP viewing areas, premium restrooms, and exclusive VIP bar access."
        },
      ],
      icalLink: "https://calendar.google.com/calendar/ical/example2@gmail.com/public/basic.ics"
    },
    {
      date: "APR 05",
      venue: "The Underground",
      location: "New York, NY",
      time: "11 PM - 4 AM",
      type: "rsvp",
      icalLink: "https://calendar.google.com/calendar/ical/example3@gmail.com/public/basic.ics"
    },
  ];

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

  if (isLoading) {
    return (
      <section className="py-20 bg-[#0A0A0A]" id="events">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Loading Events...
          </h2>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Error fetching calendar:', error);
    toast.error('Failed to load calendar events');
  }

  const displayEvents = events.length > 0 ? events : defaultEvents;

  return (
    <section className="py-20 bg-[#0A0A0A]" id="events">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Upcoming Events
        </h2>
        <div className="max-w-4xl mx-auto space-y-6">
          {displayEvents.map((event, index) => (
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
                
                <div className="flex gap-2">
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
                  <Button
                    onClick={() => handleAddToCalendar(event.icalLink, event.venue)}
                    variant="outline"
                    className="px-4"
                  >
                    Add to Calendar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};