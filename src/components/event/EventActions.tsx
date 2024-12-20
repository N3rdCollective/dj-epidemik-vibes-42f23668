import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface EventActionsProps {
  children: ReactNode;
  type: "packages" | "rsvp";
  isCameloEvent: boolean;
  venue: string;
  icalLink: string;
  handleAddToCalendar: (icalLink: string, venue: string) => void;
}

export const EventActions = ({
  children,
  type,
  isCameloEvent,
  venue,
  icalLink,
  handleAddToCalendar,
}: EventActionsProps) => {
  const downloadCalendarFile = async (icalLink: string, venue: string) => {
    try {
      console.log('Downloading calendar file for:', venue);
      const response = await fetch(icalLink);
      const icalData = await response.text();
      
      // Parse the iCal data to get individual events
      const events = icalData.split('BEGIN:VEVENT');
      
      // Find the event that matches the venue
      const targetEvent = events.find(event => event.includes(`SUMMARY:${venue}`));
      
      if (!targetEvent) {
        console.error('Event not found in calendar data');
        return;
      }
      
      // Create a new iCal file with just the header and the single event
      const header = icalData.split('BEGIN:VEVENT')[0];
      const singleEventIcal = `${header}BEGIN:VEVENT${targetEvent}END:VCALENDAR`;
      
      // Create a Blob with the single event iCal data
      const blob = new Blob([singleEventIcal], { type: 'text/calendar' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${venue.replace(/[^a-z0-9]/gi, '_')}_event.ics`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('Calendar file downloaded successfully');
    } catch (error) {
      console.error('Error downloading calendar file:', error);
    }
  };

  return (
    <div className="flex gap-2">
      {!isCameloEvent && children}
      <Button
        onClick={() => downloadCalendarFile(icalLink, venue)}
        variant="outline"
        className="px-4 whitespace-nowrap"
      >
        Add to Calendar
      </Button>
    </div>
  );
};