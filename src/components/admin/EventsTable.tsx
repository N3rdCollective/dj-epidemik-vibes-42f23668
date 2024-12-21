import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { format, isAfter, parseISO, addDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil, Trash2, RepeatIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Event {
  id: string;
  title: string;
  venue: string;
  location: string;
  start_time: string;
  end_time: string;
  type: string;
  packages?: any;
  is_imported?: boolean;
  is_live?: boolean;
  recurring_type?: string;
  recurring_end_date?: string;
  recurring_interval?: number;
}

interface EventsTableProps {
  events: Event[];
  onEventUpdate: () => void;
  onEditEvent: (event: Event) => void;
}

export const EventsTable = ({ events, onEventUpdate, onEditEvent }: EventsTableProps) => {
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

  const handleDeleteEvent = async (eventId: string) => {
    console.log('Deleting event:', eventId);
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
      return;
    }

    toast.success('Event deleted successfully');
    onEventUpdate();
  };

  const formatEventTime = (startTime: string, endTime: string) => {
    try {
      const start = parseISO(startTime);
      let end = parseISO(endTime);

      // If end time is before start time, it's the next day
      if (isAfter(start, end)) {
        end = addDays(end, 1);
      }

      return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}${isAfter(start, end) ? ' (next day)' : ''}`;
    } catch (error) {
      console.error('Error formatting event time:', error);
      return 'Invalid time';
    }
  };

  const getRecurringInfo = (event: Event) => {
    if (!event.recurring_type || event.recurring_type === 'none') return null;

    const interval = event.recurring_interval || 1;
    const endDate = event.recurring_end_date 
      ? format(new Date(event.recurring_end_date), 'MMM dd yyyy')
      : 'No end date';

    const intervalText = interval === 1 
      ? event.recurring_type 
      : `every ${interval} ${event.recurring_type}s`;

    return `Repeats ${intervalText} until ${endDate}`;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Venue</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                {event.title}
                {event.recurring_type && event.recurring_type !== 'none' && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <RepeatIcon className="h-4 w-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getRecurringInfo(event)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </TableCell>
            <TableCell>
              {format(new Date(event.start_time), 'MMM dd yyyy')}
            </TableCell>
            <TableCell>
              {formatEventTime(event.start_time, event.end_time)}
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
            <TableCell>
              <div className="flex gap-2">
                {!event.is_imported && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditEvent(event)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Event</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this event? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteEvent(event.id)}
                            className="bg-red-500 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};