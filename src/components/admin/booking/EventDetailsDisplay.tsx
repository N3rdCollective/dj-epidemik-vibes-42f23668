import { format, parseISO } from "date-fns";

interface EventDetailsDisplayProps {
  booking: any;
}

export const EventDetailsDisplay = ({ booking }: EventDetailsDisplayProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">Event Details</h3>
      <div className="text-sm">
        <p><strong>Client:</strong> {booking.name}</p>
        <p><strong>Date:</strong> {booking.event_date ? format(new Date(booking.event_date), 'PPP') : 'N/A'}</p>
        <p><strong>Time:</strong> {booking.start_time && booking.end_time ? 
          `${format(parseISO(booking.start_time), 'h:mm a')} - ${format(parseISO(booking.end_time), 'h:mm a')}` : 
          'N/A'
        }</p>
        <p><strong>Type:</strong> {booking.event_type}</p>
        <p><strong>Guests:</strong> {booking.number_of_guests}</p>
        <p><strong>Equipment Needed:</strong> {booking.needs_equipment ? 'Yes' : 'No'}</p>
        {booking.equipment_details && <p><strong>Equipment Details:</strong> {booking.equipment_details}</p>}
      </div>
    </div>
  );
};