import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
}

export const PackageSelector = ({
  packages,
  selectedPackage,
  setSelectedPackage,
  onPurchase,
}: PackageSelectorProps) => {
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
        onClick={onPurchase}
        className="w-full mt-4"
      >
        Purchase Tickets
      </Button>
    </div>
  );
};