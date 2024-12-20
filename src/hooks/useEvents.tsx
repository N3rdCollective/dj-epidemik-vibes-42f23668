import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseICalEvents } from "@/utils/icalParser";
import { toast } from "sonner";

const ICAL_URL = "https://api.camelohq.com/ical/0951e7cf-629b-4dbf-b08a-263cf483e740?smso=true&token=b1V4c2N4ck9RODAxWmZ6Q25MWT0tLXJ0c2dleFRqM3hjWSs5bDItLUpmd00wYS9hRzBMTEFQVDZTU0hoeHc9PQ%3D%3D&wid=6f6f1fb7-7065-4d7b-b965-9d2fc0f23674";

export interface ICalEvent {
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
  isCameloEvent?: boolean;
}

export const useEvents = () => {
  const { data: icalData, isLoading, error } = useQuery({
    queryKey: ['ical-events'],
    queryFn: async () => {
      console.log('Fetching iCal data...');
      const response = await axios.get(ICAL_URL);
      console.log('iCal response:', response.data);
      return response.data;
    },
  });

  const defaultEvents: ICalEvent[] = [
    {
      date: "MAR 15 2024",
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
      date: "MAR 22 2024",
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
      date: "APR 05 2024",
      venue: "The Underground",
      location: "New York, NY",
      time: "11 PM - 4 AM",
      type: "rsvp",
      icalLink: "https://calendar.google.com/calendar/ical/example3@gmail.com/public/basic.ics"
    },
  ];

  let events: ICalEvent[] = [];
  
  if (icalData) {
    try {
      const parsedEvents = parseICalEvents(icalData, ICAL_URL);
      if (parsedEvents.length > 0) {
        events = parsedEvents;
      }
    } catch (error) {
      console.error('Error parsing iCal data:', error);
      toast.error('Failed to load calendar events');
    }
  }

  return {
    events: events.length > 0 ? events : defaultEvents,
    isLoading,
    error
  };
};