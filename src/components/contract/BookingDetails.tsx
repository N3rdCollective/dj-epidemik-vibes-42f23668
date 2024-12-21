import { format } from "date-fns";

interface BookingDetailsProps {
  booking: any;
}

export const BookingDetails = ({ booking }: BookingDetailsProps) => {
  if (!booking) return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">Booking Details</h2>
      <div className="space-y-2 text-gray-600">
        <p><span className="font-medium">Event:</span> {booking.event_type}</p>
        <p><span className="font-medium">Date:</span> {booking.event_date ? format(new Date(booking.event_date), 'MMMM d, yyyy') : 'Not specified'}</p>
        <p><span className="font-medium">Time:</span> {booking.start_time ? format(new Date(booking.start_time), 'h:mm a') : 'Not specified'} - {booking.end_time ? format(new Date(booking.end_time), 'h:mm a') : 'Not specified'}</p>
        <p><span className="font-medium">Client:</span> {booking.name}</p>
        <p><span className="font-medium">Total Amount:</span> ${booking.total_amount}</p>
      </div>
    </div>
  );
};