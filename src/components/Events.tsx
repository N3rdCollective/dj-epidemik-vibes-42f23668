import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseICalEvents } from "@/utils/icalParser";
import { EventCard } from "./EventCard";
import { MonthGroup } from "./MonthGroup";
import { Button } from "./ui/button";

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
  const [showAllMonths, setShowAllMonths] = useState(false);

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

  // Group events by month and year
  const groupedEvents = displayEvents.reduce((groups: { [key: string]: ICalEvent[] }, event) => {
    const [month, , year] = event.date.split(' ');
    const monthYear = `${month} ${year}`;
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(event);
    return groups;
  }, {});

  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const currentYear = currentDate.getFullYear();
  const currentMonthYear = `${currentMonth} ${currentYear}`;

  // Filter events for current month and future months
  const sortedMonthYears = Object.keys(groupedEvents).sort((a, b) => {
    const [monthA, yearA] = a.split(' ');
    const [monthB, yearB] = b.split(' ');
    const yearDiff = parseInt(yearA) - parseInt(yearB);
    if (yearDiff !== 0) return yearDiff;
    return new Date(Date.parse(`${monthA} 1, 2000`)).getMonth() - 
           new Date(Date.parse(`${monthB} 1, 2000`)).getMonth();
  });

  // Get months to display based on showAllMonths state
  const monthsToDisplay = showAllMonths 
    ? sortedMonthYears 
    : sortedMonthYears.filter(monthYear => monthYear === currentMonthYear);

  return (
    <section className="py-20 bg-[#0A0A0A]" id="events">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Upcoming Events
        </h2>
        <div className="max-w-4xl mx-auto">
          {monthsToDisplay.map((monthYear) => (
            <MonthGroup key={monthYear} month={monthYear}>
              {groupedEvents[monthYear].map((event, index) => (
                <EventCard
                  key={index}
                  {...event}
                  selectedPackage={selectedPackage}
                  setSelectedPackage={setSelectedPackage}
                />
              ))}
            </MonthGroup>
          ))}
          
          {!showAllMonths && sortedMonthYears.length > 1 && (
            <div className="flex justify-center mt-8">
              <Button 
                onClick={() => setShowAllMonths(true)}
                className="bg-primary text-black hover:bg-primary/80 font-bold px-8"
              >
                View More Events
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
