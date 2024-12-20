import { z } from "zod";

export const bookingFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  event_date: z.string().min(1, "Event date is required"),
  event_duration: z.string().min(1, "Event duration is required"),
  event_type: z.string().min(1, "Event type is required"),
  event_description: z.string().optional().or(z.literal("")),
  number_of_guests: z.number().min(1, "Expected attendance must be at least 1").max(1000, "For events over 1000 attendees, please contact us directly"),
  needs_equipment: z.boolean().default(false),
  equipment_details: z.string().optional().or(z.literal("")),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
}).refine((data) => {
  return data.phone || data.email;
}, {
  message: "Either phone number or email must be provided for booking confirmation",
  path: ["email"],
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;