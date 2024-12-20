import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface Package {
  name: string;
  price: number;
  description: string;
}

interface PackageSelectorProps {
  packages?: Package[];
  selectedPackage: string;
  setSelectedPackage: (value: string) => void;
  onPurchase: () => void;
  eventId: string;
}

export const PackageSelector = ({
  packages,
  selectedPackage,
  setSelectedPackage,
  eventId,
}: PackageSelectorProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    if (!selectedPackage) {
      toast.error("Please select a ticket package");
      return;
    }

    setIsLoading(true);
    try {
      const selectedPkg = packages?.find(pkg => pkg.name === selectedPackage);
      if (!selectedPkg) {
        throw new Error("Selected package not found");
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          packages: [selectedPkg],
          eventId,
        },
      });

      if (error) throw error;
      if (!data.url) throw new Error("No checkout URL received");

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error("Failed to initiate checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        onClick={handlePurchase}
        className="w-full mt-4"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Purchase Tickets"}
      </Button>
    </div>
  );
};