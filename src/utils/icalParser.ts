import ICAL from 'ical';

export const parseICalEvents = (icalData: string) => {
  const events = ICAL.parseICS(icalData);
  return Object.values(events).map((event: any) => {
    if (event.type !== 'VEVENT') return null;

    const startDate = new Date(event.start);
    const month = startDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = startDate.getDate().toString().padStart(2, '0');
    
    return {
      date: `${month} ${day}`,
      venue: event.summary || 'TBA',
      location: event.location || 'TBA',
      time: `${startDate.getHours()}:${startDate.getMinutes().toString().padStart(2, '0')} - ${new Date(event.end).getHours()}:${new Date(event.end).getMinutes().toString().padStart(2, '0')}`,
      type: "packages", // Default to packages, you might want to adjust this based on your needs
      packages: [
        { 
          name: "General Admission", 
          price: 30,
          description: "Basic entry to the event"
        }
      ],
      icalLink: ICAL_URL
    };
  }).filter(Boolean);
};