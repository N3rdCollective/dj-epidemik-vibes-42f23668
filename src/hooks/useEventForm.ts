import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import { EventFormValues } from "@/components/admin/types/eventTypes";
import { parseISO } from "date-fns";
import { adjustEndTimeForNextDay } from "@/utils/timeUtils";

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

type EventInsert = Database['public']['Tables']['events']['Insert'];

export const useEventForm = (onSuccess: () => void, existingEvent?: EventFormValues & { id?: string }) => {
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

  const onSubmit = async (values: EventFormValues) => {
    console.log('Submitting event:', values);
    
    const startTime = parseISO(values.start_time);
    const endTime = adjustEndTimeForNextDay(startTime, parseISO(values.end_time));
    
    const packagesJson = values.packages?.map(pkg => ({
      name: pkg.name,
      price: pkg.price,
      description: pkg.description
    }));
    
    const eventData: EventInsert = {
      title: values.title,
      venue: values.venue,
      location: values.location,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      type: values.type,
      packages: packagesJson as Database['public']['Tables']['events']['Insert']['packages'],
      is_imported: false,
      is_live: true,
    };

    let error;
    if (existingEvent?.id) {
      console.log('Updating existing event:', existingEvent.id);
      const { error: updateError } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', existingEvent.id);
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

    toast.success(existingEvent?.id ? 'Event updated successfully' : 'Event created successfully');
    form.reset();
    onSuccess();
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};