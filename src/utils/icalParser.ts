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
      
      return {
        date: `${month} ${day}`,
        venue: event.summary || 'TBA',
        location: event.location || 'TBA',
        time: `${startDate.getHours()}:${startDate.getMinutes().toString().padStart(2, '0')} - ${endDate.getHours()}:${endDate.getMinutes().toString().padStart(2, '0')}`,
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
      // Convert date strings to Date objects for proper chronological sorting
      const yearA = new Date().getFullYear();
      const yearB = new Date().getFullYear();
      const monthA = new Date(`${a.date} ${yearA}`).getMonth();
      const monthB = new Date(`${b.date} ${yearB}`).getMonth();
      const dayA = parseInt(a.date.split(' ')[1]);
      const dayB = parseInt(b.date.split(' ')[1]);

      // First compare months
      if (monthA !== monthB) {
        return monthA - monthB;
      }
      // If months are the same, compare days
      return dayA - dayB;
    });
};