import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, addHours, parseISO } from "date-fns";

interface EditBookingDialogProps {
  booking: any;
  onUpdate: () => void;
}

export const EditBookingDialog = ({ booking, onUpdate }: EditBookingDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ratePerHour, setRatePerHour] = useState(booking.rate_per_hour || '');
  const [equipmentCost, setEquipmentCost] = useState(booking.equipment_cost || '');

  const calculateTotal = () => {
    if (!booking.start_time || !booking.end_time) return 0;

    const start = parseISO(booking.start_time);
    const end = parseISO(booking.end_time);
    
    // Add 1 hour before for setup and 1 hour after for breakdown
    const adjustedStart = addHours(start, -1);
    const adjustedEnd = addHours(end, 1);
    
    // Calculate total hours including setup and breakdown time
    const hours = Math.ceil((adjustedEnd.getTime() - adjustedStart.getTime()) / (1000 * 60 * 60));
    
    const rate = parseFloat(ratePerHour) || 0;
    const equipment = parseFloat(equipmentCost) || 0;
    
    return (rate * hours) + equipment;
  };

  const handleSave = async () => {
    try {
      const total = calculateTotal();
      console.log('Saving booking with total:', total, 'Rate:', ratePerHour, 'Equipment:', equipmentCost);

      const { error } = await supabase
        .from('dj_bookings')
        .update({ 
          rate_per_hour: parseFloat(ratePerHour),
          equipment_cost: parseFloat(equipmentCost),
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
          <div className="space-y-2">
            <h3 className="font-medium">Event Details</h3>
            <div className="text-sm">
              <p><strong>Client:</strong> {booking.name}</p>
              <p><strong>Date:</strong> {booking.event_date ? format(new Date(booking.event_date), 'PPP') : 'N/A'}</p>
              <p><strong>Time:</strong> {booking.start_time && booking.end_time ? 
                `${format(parseISO(booking.start_time), 'h:mm a')} - ${format(parseISO(booking.end_time), 'h:mm a')}` : 
                'N/A'
              }</p>
              <p><strong>Type:</strong> {booking.event_type}</p>
              <p><strong>Guests:</strong> {booking.number_of_guests}</p>
              <p><strong>Equipment Needed:</strong> {booking.needs_equipment ? 'Yes' : 'No'}</p>
              {booking.equipment_details && <p><strong>Equipment Details:</strong> {booking.equipment_details}</p>}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rate">Rate per Hour ($)</Label>
            <Input
              id="rate"
              type="number"
              value={ratePerHour}
              onChange={(e) => setRatePerHour(e.target.value)}
              placeholder="Enter hourly rate"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="equipment">Equipment Cost ($)</Label>
            <Input
              id="equipment"
              type="number"
              value={equipmentCost}
              onChange={(e) => setEquipmentCost(e.target.value)}
              placeholder="Enter equipment cost"
            />
          </div>
          <div className="pt-2 border-t">
            <p className="text-sm font-medium">
              Estimated Total: ${calculateTotal().toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              *Includes 1 hour setup and 1 hour breakdown time
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};