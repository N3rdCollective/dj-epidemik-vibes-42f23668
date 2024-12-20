import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  venue: string;
  location: string;
  start_time: string;
  is_imported?: boolean;
  is_live?: boolean;
}

interface EventsTableProps {
  events: Event[];
  onEventUpdate: () => void;
}

export const EventsTable = ({ events, onEventUpdate }: EventsTableProps) => {
  const toggleEventVisibility = async (eventId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('events')
      .update({ is_live: !currentStatus })
      .eq('id', eventId);

    if (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event visibility');
      return;
    }

    toast.success('Event visibility updated');
    onEventUpdate();
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Venue</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell>{event.title}</TableCell>
            <TableCell>
              {format(new Date(event.start_time), 'MMM dd yyyy')}
            </TableCell>
            <TableCell>{event.venue}</TableCell>
            <TableCell>{event.location}</TableCell>
            <TableCell>
              {event.is_imported ? 'Camelo' : 'Manual'}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Switch
                  checked={event.is_live}
                  onCheckedChange={() => toggleEventVisibility(event.id, !!event.is_live)}
                  disabled={event.is_imported}
                />
                <span>{event.is_live ? 'Live' : 'Draft'}</span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};