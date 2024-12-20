import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface Package {
  name: string;
  price: number;
  description: string;
}

interface EventCardProps {
  id?: string;
  date: string;
  venue: string;
  location: string;
  time: string;
  type: "packages" | "rsvp";
  packages?: Package[];
  icalLink: string;
  selectedPackage: string;
  setSelectedPackage: (value: string) => void;
  isCameloEvent?: boolean;
}

const rsvpFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

type RsvpFormValues = z.infer<typeof rsvpFormSchema>;

export const EventCard = ({
  id,
  date,
  venue,
  location,
  time,
  type,
  packages,
  icalLink,
  selectedPackage,
  setSelectedPackage,
  isCameloEvent = false,
}: EventCardProps) => {
  const [isRsvpDialogOpen, setIsRsvpDialogOpen] = useState(false);
  const form = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const handleRSVP = async (values: RsvpFormValues) => {
    try {
      console.log("Submitting RSVP:", { eventId: id, ...values });
      const { error } = await supabase
        .from("rsvps")
        .insert([
          {
            event_id: id,
            name: values.name,
            email: values.email || null,
            phone: values.phone || null,
          },
        ]);

      if (error) throw error;

      toast.success("RSVP Confirmed! See you at the event!");
      setIsRsvpDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      toast.error("Failed to submit RSVP. Please try again.");
    }
  };

  const handleTicketPurchase = (eventName: string) => {
    if (!selectedPackage) {
      toast.error("Please select a ticket package");
      return;
    }
    toast.success(`Ticket purchase initiated for ${eventName} - ${selectedPackage}`);
    setSelectedPackage("");
  };

  const handleAddToCalendar = (icalLink: string, eventName: string) => {
    window.open(icalLink, '_blank');
    toast.success(`Added ${eventName} to your calendar!`);
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-3xl font-bold text-primary animate-float">
          {date}
        </div>
        <div className="text-center md:text-left flex-1">
          <h3 className="text-2xl font-semibold text-white mb-1">{venue}</h3>
          <p className="text-gray-400">{location}</p>
        </div>
        <div className="text-gray-300 font-medium whitespace-nowrap">
          {time}
        </div>
        <div className="flex gap-2">
          {!isCameloEvent && (
            type === "packages" ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-black hover:bg-primary/80 font-bold px-8">
                    Get Tickets
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Select Ticket Package</DialogTitle>
                    <DialogDescription>
                      Choose your preferred ticket package for {venue}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <RadioGroup
                      value={selectedPackage}
                      onValueChange={setSelectedPackage}
                    >
                      {packages?.map((pkg, idx) => (
                        <div key={idx} className="flex flex-col space-y-2 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={pkg.name} id={`${pkg.name}-${idx}`} />
                            <Label htmlFor={`${pkg.name}-${idx}`} className="flex justify-between w-full">
                              <span>{pkg.name}</span>
                              <span className="text-primary font-bold">${pkg.price}</span>
                            </Label>
                          </div>
                          <p className="text-sm text-gray-500 ml-6">{pkg.description}</p>
                        </div>
                      ))}
                    </RadioGroup>
                    <Button 
                      onClick={() => handleTicketPurchase(venue)}
                      className="w-full mt-4"
                    >
                      Purchase Tickets
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog open={isRsvpDialogOpen} onOpenChange={setIsRsvpDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-black hover:bg-primary/80 font-bold px-8">
                    RSVP Now
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>RSVP for {venue}</DialogTitle>
                    <DialogDescription>
                      Fill out the form below to reserve your spot
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleRSVP)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
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
                            <FormLabel>Email (Optional)</FormLabel>
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
                            <FormLabel>Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="(123) 456-7890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">
                        Submit RSVP
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )
          )}
          <Button
            onClick={() => handleAddToCalendar(icalLink, venue)}
            variant="outline"
            className="px-4 whitespace-nowrap"
          >
            Add to Calendar
          </Button>
        </div>
      </div>
    </div>
  );
};