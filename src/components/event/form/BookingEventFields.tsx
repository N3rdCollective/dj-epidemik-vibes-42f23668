import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "../types/bookingTypes";

interface BookingEventFieldsProps {
  form: UseFormReturn<BookingFormValues>;
}

export const BookingEventFields = ({ form }: BookingEventFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="event_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Date *</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="event_duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Duration *</FormLabel>
            <FormControl>
              <Input 
                type="text" 
                placeholder="e.g., 4 hours, 6 hours" 
                {...field} 
              />
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
    </>
  );
};