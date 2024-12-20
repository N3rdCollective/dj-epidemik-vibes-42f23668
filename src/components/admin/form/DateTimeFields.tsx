import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "../types/eventTypes";
import { parseISO, format } from "date-fns";

interface DateTimeFieldsProps {
  form: UseFormReturn<EventFormValues>;
}

export const DateTimeFields = ({ form }: DateTimeFieldsProps) => {
  // Convert the datetime-local value to 12-hour format for display
  const formatDisplayTime = (isoString: string) => {
    if (!isoString) return '';
    const date = parseISO(isoString);
    return format(date, "MM/dd/yyyy hh:mm a");
  };

  return (
    <>
      <FormField
        control={form.control}
        name="start_time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start Time</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type="datetime-local" 
                  {...field} 
                  className="opacity-0 absolute inset-0 cursor-pointer" 
                />
                <Input 
                  type="text" 
                  value={formatDisplayTime(field.value)}
                  readOnly 
                  className="pointer-events-none"
                  placeholder="Select date and time"
                />
              </div>
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
              <div className="relative">
                <Input 
                  type="datetime-local" 
                  {...field}
                  className="opacity-0 absolute inset-0 cursor-pointer" 
                />
                <Input 
                  type="text" 
                  value={formatDisplayTime(field.value)}
                  readOnly 
                  className="pointer-events-none"
                  placeholder="Select date and time"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};