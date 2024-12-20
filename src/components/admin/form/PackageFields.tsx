import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "../types/eventTypes";
import { Plus, Trash2 } from "lucide-react";

interface PackageFieldsProps {
  form: UseFormReturn<EventFormValues>;
  showPackages: boolean;
}

export const PackageFields = ({ form, showPackages }: PackageFieldsProps) => {
  const packages = form.watch('packages') || [];

  const addPackage = () => {
    const currentPackages = form.getValues('packages') || [];
    form.setValue('packages', [
      ...currentPackages,
      { name: '', price: 0, description: '' }
    ]);
  };

  const removePackage = (index: number) => {
    const currentPackages = form.getValues('packages') || [];
    form.setValue('packages', currentPackages.filter((_, i) => i !== index));
  };

  if (!showPackages) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Packages</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addPackage}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Package
        </Button>
      </div>

      {packages.map((_, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => removePackage(index)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>

          <FormField
            control={form.control}
            name={`packages.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Package Name</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`packages.${index}.price`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`packages.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <Textarea {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  );
};