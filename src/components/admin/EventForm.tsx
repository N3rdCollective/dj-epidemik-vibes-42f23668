import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  venue: z.string().min(1, "Venue is required"),
  location: z.string().min(1, "Location is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  type: z.string().min(1, "Type is required"),
  packages: z.array(z.object({
    name: z.string(),
    price: z.number(),
    description: z.string()
  })).optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

type EventInsert = Database['public']['Tables']['events']['Insert'];

interface EventFormProps {
  onSuccess: () => void;
  event?: {
    id: string;
    title: string;
    venue: string;
    location: string;
    start_time: string;
    end_time: string;
    type: string;
    packages?: {
      name: string;
      price: number;
      description: string;
    }[];
  };
}

export const EventForm = ({ onSuccess, event }: EventFormProps) => {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      venue: "",
      location: "",
      start_time: "",
      end_time: "",
      type: "packages",
      packages: [],
    },
  });

  useEffect(() => {
    if (event) {
      console.log('Setting form values for event:', event);
      // Format the date-time string to match the input format
      const startTime = new Date(event.start_time).toISOString().slice(0, 16);
      const endTime = new Date(event.end_time).toISOString().slice(0, 16);
      
      form.reset({
        title: event.title,
        venue: event.venue,
        location: event.location,
        start_time: startTime,
        end_time: endTime,
        type: event.type,
        packages: event.packages || [],
      });
    }
  }, [event, form]);

  const onSubmit = async (values: EventFormValues) => {
    console.log('Submitting event:', values);
    
    const eventData: EventInsert = {
      title: values.title,
      venue: values.venue,
      location: values.location,
      start_time: values.start_time,
      end_time: values.end_time,
      type: values.type,
      packages: values.packages,
      is_imported: false,
      is_live: true,
    };

    let error;
    if (event?.id) {
      console.log('Updating existing event:', event.id);
      const { error: updateError } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', event.id);
      error = updateError;
    } else {
      console.log('Creating new event');
      const { error: insertError } = await supabase
        .from('events')
        .insert(eventData);
      error = insertError;
    }

    if (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
      return;
    }

    toast.success(event?.id ? 'Event updated successfully' : 'Event created successfully');
    form.reset();
    onSuccess();
  };

  return (
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
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="packages">Packages</SelectItem>
                  <SelectItem value="rsvp">RSVP</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {event?.id ? 'Update Event' : 'Create Event'}
        </Button>
      </form>
    </Form>
  );
};