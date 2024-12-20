import ICAL from 'ical';

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

export const parseICalEvents = (icalData: string, icalUrl: string): ICalEvent[] => {
  console.log('Parsing iCal data:', icalData);
  const events = ICAL.parseICS(icalData);
  console.log('Parsed events:', events);
  const now = new Date();
  
  return Object.values(events)
    .filter((event: any) => {
      // Filter for VEVENT type and future dates only
      if (event.type !== 'VEVENT') return false;
      const eventStart = new Date(event.start);
      return eventStart >= now;
    })
    .map((event: any): ICalEvent => {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      
      // Format date with full month name and day
      const month = startDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      const day = startDate.getDate().toString().padStart(2, '0');
      const year = startDate.getFullYear();

      // Format time in 12-hour format with AM/PM
      const startTime = startDate.toLocaleString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true 
      });
      const endTime = endDate.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      return {
        date: `${month} ${day} ${year}`,
        venue: event.summary || 'TBA',
        location: event.location || 'TBA',
        time: `${startTime} - ${endTime}`,
        type: "packages",
        packages: [
          { 
            name: "General Admission", 
            price: 30,
            description: "Basic entry to the event"
          },
          {
            name: "VIP Access",
            price: 75,
            description: "Premium entry with VIP area access"
          }
        ],
        icalLink: icalUrl
      };
    })
    .sort((a: ICalEvent, b: ICalEvent) => {
      // Parse dates for comparison
      const [monthA, dayA, yearA] = a.date.split(' ');
      const [monthB, dayB, yearB] = b.date.split(' ');
      
      // Convert month names to numbers (0-11)
      const monthNumA = new Date(Date.parse(`${monthA} 1, 2000`)).getMonth();
      const monthNumB = new Date(Date.parse(`${monthB} 1, 2000`)).getMonth();
      
      // Compare years first
      const yearDiff = parseInt(yearA) - parseInt(yearB);
      if (yearDiff !== 0) return yearDiff;
      
      // If years are equal, compare months
      if (monthNumA !== monthNumB) {
        return monthNumA - monthNumB;
      }
      
      // If months are equal, compare days
      return parseInt(dayA) - parseInt(dayB);
    });
};