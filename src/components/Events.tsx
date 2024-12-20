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
    try {
      console.log('Processing event time:', event.time);
      const [startTimeStr, endTimeStr] = event.time.split(' - ');
      
      // Convert time strings to ISO format for parsing
      const startDate = new Date();
      const endDate = new Date();
      
      const [startHour, startMinute, startPeriod] = startTimeStr.match(/(\d+):(\d+)\s*(AM|PM)/i).slice(1);
      const [endHour, endMinute, endPeriod] = endTimeStr.match(/(\d+):(\d+)\s*(AM|PM)/i).slice(1);
      
      // Convert to 24-hour format
      let start24Hour = parseInt(startHour);
      if (startPeriod.toUpperCase() === 'PM' && start24Hour !== 12) start24Hour += 12;
      if (startPeriod.toUpperCase() === 'AM' && start24Hour === 12) start24Hour = 0;
      
      let end24Hour = parseInt(endHour);
      if (endPeriod.toUpperCase() === 'PM' && end24Hour !== 12) end24Hour += 12;
      if (endPeriod.toUpperCase() === 'AM' && end24Hour === 12) end24Hour = 0;
      
      startDate.setHours(start24Hour, parseInt(startMinute), 0);
      endDate.setHours(end24Hour, parseInt(endMinute), 0);
      
      // If end time is before start time, it means it's the next day
      if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
      }
      
      return {
        ...event,
        time: `${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`,
      };
    } catch (error) {
      console.error('Error processing event time:', error, event);
      return event; // Return original event if parsing fails
    }
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
                  id={event.id}
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