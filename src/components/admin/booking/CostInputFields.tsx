import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CostInputFieldsProps {
  ratePerHour: string;
  equipmentCost: string;
  onRateChange: (value: string) => void;
  onEquipmentCostChange: (value: string) => void;
}

export const CostInputFields = ({ 
  ratePerHour, 
  equipmentCost, 
  onRateChange, 
  onEquipmentCostChange 
}: CostInputFieldsProps) => {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="rate">Rate per Hour ($)</Label>
        <Input
          id="rate"
          type="number"
          value={ratePerHour}
          onChange={(e) => onRateChange(e.target.value)}
          placeholder="Enter hourly rate"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="equipment">Equipment Cost ($)</Label>
        <Input
          id="equipment"
          type="number"
          value={equipmentCost}
          onChange={(e) => onEquipmentCostChange(e.target.value)}
          placeholder="Enter equipment cost"
        />
      </div>
    </>
  );
};