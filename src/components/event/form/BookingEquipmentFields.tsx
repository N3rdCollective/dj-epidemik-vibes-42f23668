import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "../types/bookingTypes";

interface BookingEquipmentFieldsProps {
  form: UseFormReturn<BookingFormValues>;
  showEquipmentDetails: boolean;
}

export const BookingEquipmentFields = ({ form, showEquipmentDetails }: BookingEquipmentFieldsProps) => {
  return (
    <>
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
    </>
  );
};