import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
        name="event_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Type *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="wedding">Wedding</SelectItem>
                <SelectItem value="corporate">Corporate Event</SelectItem>
                <SelectItem value="birthday">Birthday Party</SelectItem>
                <SelectItem value="nightclub">Nightclub</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="event_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Description (Optional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Tell us more about your event..."
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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