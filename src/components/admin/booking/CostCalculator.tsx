import { addHours, parseISO } from "date-fns";

export const calculateBookingTotal = (booking: any, ratePerHour: number, equipmentCost: number) => {
  if (!booking.start_time || !booking.end_time) return 0;

  const start = parseISO(booking.start_time);
  const end = parseISO(booking.end_time);
  
  // Add 1 hour before for setup and 1 hour after for breakdown
  const adjustedStart = addHours(start, -1);
  const adjustedEnd = addHours(end, 1);
  
  // Calculate total hours including setup and breakdown time
  const hours = Math.ceil((adjustedEnd.getTime() - adjustedStart.getTime()) / (1000 * 60 * 60));
  
  console.log('Calculating total with:', {
    hours,
    ratePerHour,
    equipmentCost,
    total: (ratePerHour * hours) + equipmentCost
  });
  
  return (ratePerHour * hours) + equipmentCost;
};

interface TotalDisplayProps {
  total: number;
}

export const TotalDisplay = ({ total }: TotalDisplayProps) => {
  return (
    <div className="pt-2 border-t">
      <p className="text-sm font-medium">
        Estimated Total: ${total.toFixed(2)}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        *Includes 1 hour setup and 1 hour breakdown time
      </p>
    </div>
  );
};