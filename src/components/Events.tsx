import { useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import { EventCard } from "./EventCard";
import { MonthGroup } from "./MonthGroup";
import { Button } from "./ui/button";
import { groupEventsByMonth, getCurrentMonthYear, sortMonthYears } from "@/utils/eventGrouping";
import { format, isAfter, parseISO, addDays } from "date-fns";

export const Events = () => {
  const [selectedPackage, setSelectedPackage] = useState("");
  const [showAllMonths, setShowAllMonths] = useState(false);
  
  const { events, isLoading } = useEvents();

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

  // Process events to handle next-day end times
  const processedEvents = events.map(event => {
    const startTime = parseISO(event.time.split(' - ')[0]);
    let endTime = parseISO(event.time.split(' - ')[1]);
    
    // If end time is before start time, it means it's the next day
    if (isAfter(startTime, endTime)) {
      endTime = addDays(endTime, 1);
    }

    return {
      ...event,
      time: `${format(startTime, 'h:mm a')} - ${format(endTime, 'h:mm a')}`,
    };
  });

  const groupedEvents = groupEventsByMonth(processedEvents);
  const currentMonthYear = getCurrentMonthYear();
  const sortedMonthYears = sortMonthYears(Object.keys(groupedEvents));
  
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