import { ICalEvent } from "@/hooks/useEvents";

export const groupEventsByMonth = (events: ICalEvent[]) => {
  return events.reduce((groups: { [key: string]: ICalEvent[] }, event) => {
    const [month, , year] = event.date.split(' ');
    const monthYear = `${month} ${year}`;
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(event);
    return groups;
  }, {});
};

export const getCurrentMonthYear = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const currentYear = currentDate.getFullYear();
  return `${currentMonth} ${currentYear}`;
};

export const sortMonthYears = (monthYears: string[]) => {
  return monthYears.sort((a, b) => {
    const [monthA, yearA] = a.split(' ');
    const [monthB, yearB] = b.split(' ');
    const yearDiff = parseInt(yearA) - parseInt(yearB);
    if (yearDiff !== 0) return yearDiff;
    return new Date(Date.parse(`${monthA} 1, 2000`)).getMonth() - 
           new Date(Date.parse(`${monthB} 1, 2000`)).getMonth();
  });
};