import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "../types/eventTypes";
import { Checkbox } from "@/components/ui/checkbox";

interface RecurringEventFieldsProps {
  form: UseFormReturn<EventFormValues>;
}

export const RecurringEventFields = ({ form }: RecurringEventFieldsProps) => {
  const recurringType = form.watch('recurring_type');

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="recurring_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Recurring Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select recurring type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {recurringType !== 'none' && (
        <>
          <FormField
            control={form.control}
            name="recurring_end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recurring_interval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interval</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1} 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {recurringType === 'weekly' && (
            <FormField
              control={form.control}
              name="recurring_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Days of Week</FormLabel>
                  <div className="flex gap-4">
                    {[
                      { label: 'Sun', value: 0 },
                      { label: 'Mon', value: 1 },
                      { label: 'Tue', value: 2 },
                      { label: 'Wed', value: 3 },
                      { label: 'Thu', value: 4 },
                      { label: 'Fri', value: 5 },
                      { label: 'Sat', value: 6 },
                    ].map((day) => (
                      <FormItem
                        key={day.value}
                        className="flex flex-row items-center space-x-2"
                      >
                        <Checkbox
                          checked={field.value?.includes(day.value)}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            const newValue = checked
                              ? [...currentValue, day.value]
                              : currentValue.filter((v) => v !== day.value);
                            field.onChange(newValue);
                          }}
                        />
                        <FormLabel className="text-sm font-normal">
                          {day.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </>
      )}
    </div>
  );
};