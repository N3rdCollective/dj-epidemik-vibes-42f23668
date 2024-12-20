import ICAL from 'ical';

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
}

export const parseICalEvents = (icalData: string, icalUrl: string): ICalEvent[] => {
  console.log('Parsing iCal data:', icalData);
  const events = ICAL.parseICS(icalData);
  console.log('Parsed events:', events);
  const now = new Date();
  
  return Object.values(events)
    .filter((event: any) => {
      if (event.type !== 'VEVENT') return false;
      const eventStart = new Date(event.start);
      return eventStart >= now;
    })
    .map((event: any): ICalEvent => {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      
      const month = startDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      const day = startDate.getDate().toString().padStart(2, '0');
      const year = startDate.getFullYear();

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
        icalLink: icalUrl,
        isCameloEvent: true
      };
    })
    .sort((a: ICalEvent, b: ICalEvent) => {
      const [monthA, dayA, yearA] = a.date.split(' ');
      const [monthB, dayB, yearB] = b.date.split(' ');
      
      const monthNumA = new Date(Date.parse(`${monthA} 1, 2000`)).getMonth();
      const monthNumB = new Date(Date.parse(`${monthB} 1, 2000`)).getMonth();
      
      const yearDiff = parseInt(yearA) - parseInt(yearB);
      if (yearDiff !== 0) return yearDiff;
      
      if (monthNumA !== monthNumB) {
        return monthNumA - monthNumB;
      }
      
      return parseInt(dayA) - parseInt(dayB);
    });
};