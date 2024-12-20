import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useEvents } from "@/hooks/useEvents";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  venue: z.string().min(1, "Venue is required"),
  location: z.string().min(1, "Location is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  type: z.string().min(1, "Type is required"),
});

const EventManagement = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { events: cameloEvents } = useEvents();

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      venue: "",
      location: "",
      start_time: "",
      end_time: "",
      type: "packages",
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!isAdmin) {
      navigate("/");
    }
  }, [user, isAdmin, navigate]);

  const { data: dbEvents, refetch } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      console.log('Fetching all events for admin...');
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true });
      
      if (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
        throw error;
      }

      console.log('Fetched database events:', data);
      return data || [];
    },
  });

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
    refetch();
  };

  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
    console.log('Creating new event:', values);
    const { error } = await supabase
      .from('events')
      .insert([values]);

    if (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
      return;
    }

    toast.success('Event created successfully');
    form.reset();
    refetch();
  };

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  if (!user || !isAdmin) return null;

  // Combine and format both database and Camelo events
  const allEvents = [
    ...(dbEvents || []),
    ...cameloEvents.map(event => ({
      id: event.icalLink,
      title: `${event.venue} Event`,
      venue: event.venue,
      location: event.location,
      start_time: new Date(event.date).toISOString(),
      is_imported: true,
      is_live: true // Camelo events are always live
    }))
  ];

  console.log('All events (combined):', allEvents);

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Event Management</h1>
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add New Event</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="start_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="end_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Create Event</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
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
              {allEvents.map((event) => (
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
                        onCheckedChange={() => toggleEventVisibility(event.id, event.is_live)}
                        disabled={event.is_imported}
                      />
                      <span>{event.is_live ? 'Live' : 'Draft'}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default EventManagement;