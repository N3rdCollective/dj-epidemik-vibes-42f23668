import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "../types/eventTypes";
import { addDays, isAfter, parseISO } from "date-fns";

interface DateTimeFieldsProps {
  form: UseFormReturn<EventFormValues>;
}

export const DateTimeFields = ({ form }: DateTimeFieldsProps) => {
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startTime = parseISO(form.getValues("start_time"));
    const endTime = parseISO(e.target.value);
    
    // If end time is before start time, assume it's the next day
    if (isAfter(startTime, endTime)) {
      const nextDayEndTime = addDays(endTime, 1);
      form.setValue("end_time", nextDayEndTime.toISOString().slice(0, 16));
    } else {
      form.setValue("end_time", e.target.value);
    }
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
              <Input 
                type="datetime-local" 
                {...field} 
                onChange={handleEndTimeChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};