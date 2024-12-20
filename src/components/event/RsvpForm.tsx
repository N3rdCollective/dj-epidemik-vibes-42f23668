import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BookingContactFields } from "./form/BookingContactFields";
import { BookingEventFields } from "./form/BookingEventFields";
import { BookingEquipmentFields } from "./form/BookingEquipmentFields";
import { bookingFormSchema, BookingFormValues } from "./types/bookingTypes";

interface RsvpFormProps {
  eventId: string;
  onSuccess: () => void;
}

export const RsvpForm = ({ eventId, onSuccess }: RsvpFormProps) => {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      event_date: "",
      event_duration: "",
      event_type: "",
      event_description: "",
      number_of_guests: 1,
      needs_equipment: false,
      equipment_details: "",
      start_time: "",
      end_time: "",
    },
  });

  const handleRSVP = async (values: BookingFormValues) => {
    try {
      console.log("Submitting booking request:", { eventId, ...values });
      const { error } = await supabase
        .from("rsvps")
        .insert([
          {
            event_id: eventId,
            name: values.name,
            email: values.email || null,
            phone: values.phone || null,
            event_date: values.event_date,
            event_duration: values.event_duration,
            event_type: values.event_type,
            event_description: values.event_description || null,
            number_of_guests: values.number_of_guests,
            needs_equipment: values.needs_equipment,
            equipment_details: values.equipment_details || null,
            start_time: values.start_time,
            end_time: values.end_time,
          },
        ]);

      if (error) throw error;

      toast.success("Booking request submitted! We'll be in touch soon to confirm your event.");
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Failed to submit booking request. Please try again or contact us directly.");
    }
  };

  const showEquipmentDetails = form.watch("needs_equipment");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRSVP)} className="space-y-4">
        <BookingContactFields form={form} />
        <BookingEventFields form={form} />
        <BookingEquipmentFields 
          form={form} 
          showEquipmentDetails={showEquipmentDetails}
        />
        <Button type="submit" className="w-full">
          Submit Booking Request
        </Button>
      </form>
    </Form>
  );
};