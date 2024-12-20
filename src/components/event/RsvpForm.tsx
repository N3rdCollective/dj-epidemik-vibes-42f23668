import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const rsvpFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  number_of_guests: z.number().min(1, "Expected attendance must be at least 1").max(1000, "For events over 1000 attendees, please contact us directly"),
  needs_equipment: z.boolean().default(false),
  equipment_details: z.string().optional().or(z.literal(""))
}).refine((data) => {
  return data.phone || data.email;
}, {
  message: "Either phone number or email must be provided for booking confirmation",
  path: ["email"],
});

type RsvpFormValues = z.infer<typeof rsvpFormSchema>;

interface RsvpFormProps {
  eventId: string;
  onSuccess: () => void;
}

export const RsvpForm = ({ eventId, onSuccess }: RsvpFormProps) => {
  const form = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      number_of_guests: 1,
      needs_equipment: false,
      equipment_details: "",
    },
  });

  const handleRSVP = async (values: RsvpFormValues) => {
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
            number_of_guests: values.number_of_guests,
            needs_equipment: values.needs_equipment,
            equipment_details: values.equipment_details || null,
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Organizer Name *</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (Required for booking confirmation)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (Alternative contact method)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="(123) 456-7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="number_of_guests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected Attendance *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={1} 
                  max={1000} 
                  {...field} 
                  onChange={e => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="needs_equipment"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Venue has sound equipment available
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        {showEquipmentDetails && (
          <FormField
            control={form.control}
            name="equipment_details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipment Details</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Please describe the available sound equipment at the venue..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" className="w-full">
          Submit Booking Request
        </Button>
      </form>
    </Form>
  );
};