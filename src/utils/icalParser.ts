import ICAL from 'ical';
import { format, parseISO } from 'date-fns';

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
  isCameloEvent: boolean;
  icalUid?: string;
}

export const parseICalEvents = (icalData: string, icalUrl: string): ICalEvent[] => {
  console.log('Parsing iCal data...');
  const events = ICAL.parseICS(icalData);
  console.log('Found events:', Object.keys(events).length);
  const now = new Date();
  
  return Object.values(events)
    .filter((event: any) => {
      if (event.type !== 'VEVENT') return false;
      const eventStart = new Date(event.start);
      return eventStart >= now;
    })
    .map((event: any): ICalEvent => {
      console.log('Processing event:', event.summary);
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      
      const month = startDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      const day = startDate.getDate().toString().padStart(2, '0');
      const year = startDate.getFullYear();

      const startTime = format(startDate, 'h:mm a');
      const endTime = format(endDate, 'h:mm a');
      
      // Extract venue and location from event data
      let venue = event.summary || 'TBA';
      let location = event.location || 'TBA';
      
      // If location contains venue name, split it
      if (location && location.includes('\n')) {
        const [venuePart, ...locationParts] = location.split('\n');
        venue = venuePart;
        location = locationParts.join(', ').replace(/,\s*United States$/, '');
      }
      
      return {
        date: `${month} ${day} ${year}`,
        venue: venue,
        location: location,
        time: `${startTime} - ${endTime}`,
        type: "packages", // Default type
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
        icalLink: icalUrl,
        isCameloEvent: false,
        icalUid: event.uid
      };
    })
    .sort((a: ICalEvent, b: ICalEvent) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
};