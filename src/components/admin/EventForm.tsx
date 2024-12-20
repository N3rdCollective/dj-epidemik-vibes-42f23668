import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { BasicEventFields } from "./form/BasicEventFields";
import { DateTimeFields } from "./form/DateTimeFields";
import { EventTypeField } from "./form/EventTypeField";
import { PackageFields } from "./form/PackageFields";
import { Package } from "./types/eventTypes";
import { useEventForm } from "@/hooks/useEventForm";
import { formatDateTimeForInput, adjustEndTimeForFormDisplay } from "@/utils/timeUtils";

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
    packages?: Package[];
  };
}

export const EventForm = ({ onSuccess, event }: EventFormProps) => {
  const { form, onSubmit } = useEventForm(onSuccess, event);
  const eventType = form.watch('type');

  useEffect(() => {
    if (event) {
      console.log('Setting form values for event:', event);
      const startTime = new Date(event.start_time);
      const endTime = adjustEndTimeForFormDisplay(
        startTime,
        new Date(event.end_time)
      );
      
      form.reset({
        title: event.title,
        venue: event.venue,
        location: event.location,
        start_time: formatDateTimeForInput(startTime),
        end_time: formatDateTimeForInput(endTime),
        type: event.type,
        packages: event.packages || [],
      });
    }
  }, [event, form]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <BasicEventFields form={form} />
        <DateTimeFields form={form} />
        <EventTypeField form={form} />
        <PackageFields form={form} showPackages={eventType === 'packages'} />
        <Button type="submit" className="w-full">
          {event?.id ? 'Update Event' : 'Create Event'}
        </Button>
      </form>
    </Form>
  );
};