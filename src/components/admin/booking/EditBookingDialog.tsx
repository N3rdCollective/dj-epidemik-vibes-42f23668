import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EventDetailsDisplay } from "./EventDetailsDisplay";
import { CostInputFields } from "./CostInputFields";
import { calculateBookingTotal, TotalDisplay } from "./CostCalculator";

interface EditBookingDialogProps {
  booking: any;
  onUpdate: () => void;
}

export const EditBookingDialog = ({ booking, onUpdate }: EditBookingDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ratePerHour, setRatePerHour] = useState(booking.rate_per_hour?.toString() || '');
  const [equipmentCost, setEquipmentCost] = useState(booking.equipment_cost?.toString() || '');

  const handleSave = async () => {
    try {
      // Ensure we have valid numbers for calculations
      const rate = parseFloat(ratePerHour) || 0;
      const equipment = parseFloat(equipmentCost) || 0;
      const total = calculateBookingTotal(booking, rate, equipment);
      
      console.log('Saving booking with:', {
        rate_per_hour: rate,
        equipment_cost: equipment,
        total_amount: total
      });

      const { error } = await supabase
        .from('dj_bookings')
        .update({ 
          rate_per_hour: rate,
          equipment_cost: equipment,
          total_amount: total
        })
        .eq('id', booking.id);

      if (error) throw error;

      toast.success('Booking details updated successfully');
      onUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking details');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Booking Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <EventDetailsDisplay booking={booking} />
          <CostInputFields
            ratePerHour={ratePerHour}
            equipmentCost={equipmentCost}
            onRateChange={setRatePerHour}
            onEquipmentCostChange={setEquipmentCost}
          />
          <TotalDisplay total={calculateBookingTotal(booking, parseFloat(ratePerHour) || 0, parseFloat(equipmentCost) || 0)} />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};