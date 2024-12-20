import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, addHours, parseISO } from "date-fns";
import { toast } from "sonner";

const BookingManagement = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!isAdmin) {
      navigate("/");
    }
  }, [user, isAdmin, navigate]);

  const { data: bookings, isLoading, refetch } = useQuery({
    queryKey: ['dj-bookings'],
    queryFn: async () => {
      console.log('Fetching DJ bookings...');
      const { data, error } = await supabase
        .from('dj_bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching DJ bookings:', error);
        toast.error('Failed to load DJ bookings');
        throw error;
      }

      console.log('Fetched DJ bookings:', data);
      return data || [];
    },
  });

  const calculateTotal = (booking: any, newRate?: number, newEquipmentCost?: number) => {
    if (!booking.start_time || !booking.end_time) return 0;

    const start = parseISO(booking.start_time);
    const end = parseISO(booking.end_time);
    
    // Add 1 hour before for setup and 1 hour after for breakdown
    const adjustedStart = addHours(start, -1);
    const adjustedEnd = addHours(end, 1);
    
    // Calculate total hours including setup and breakdown time
    const hours = Math.ceil((adjustedEnd.getTime() - adjustedStart.getTime()) / (1000 * 60 * 60));
    
    const rate = newRate ?? booking.rate_per_hour ?? 0;
    const equipmentCost = newEquipmentCost ?? booking.equipment_cost ?? 0;
    
    return (rate * hours) + Number(equipmentCost);
  };

  const handleRateUpdate = async (bookingId: string, rate: number) => {
    try {
      const booking = bookings?.find(b => b.id === bookingId);
      if (!booking) return;

      const total = calculateTotal(booking, rate);

      const { error } = await supabase
        .from('dj_bookings')
        .update({ 
          rate_per_hour: rate,
          total_amount: total
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success('Rate and total updated successfully');
      refetch();
    } catch (error) {
      console.error('Error updating rate:', error);
      toast.error('Failed to update rate');
    }
  };

  const handleEquipmentCostUpdate = async (bookingId: string, equipmentCost: number) => {
    try {
      const booking = bookings?.find(b => b.id === bookingId);
      if (!booking) return;

      const total = calculateTotal(booking, undefined, equipmentCost);

      const { error } = await supabase
        .from('dj_bookings')
        .update({ 
          equipment_cost: equipmentCost,
          total_amount: total
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success('Equipment cost and total updated successfully');
      refetch();
    } catch (error) {
      console.error('Error updating equipment cost:', error);
      toast.error('Failed to update equipment cost');
    }
  };

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  if (!user || !isAdmin) return null;
  if (isLoading) return <div className="container mx-auto px-4 py-8 mt-16">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">DJ Booking Requests</h1>
        <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Equipment Needed</TableHead>
                <TableHead>Rate/Hour ($)</TableHead>
                <TableHead>Equipment Cost ($)</TableHead>
                <TableHead>Total ($)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings?.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.name}</TableCell>
                  <TableCell>{booking.email}</TableCell>
                  <TableCell>{booking.phone}</TableCell>
                  <TableCell>
                    {booking.event_date ? format(new Date(booking.event_date), 'PPP') : 'N/A'}
                  </TableCell>
                  <TableCell>{booking.event_type}</TableCell>
                  <TableCell>
                    {booking.start_time && booking.end_time ? (
                      `${format(parseISO(booking.start_time), 'h:mm a')} - ${format(parseISO(booking.end_time), 'h:mm a')} (+2hrs setup/breakdown)`
                    ) : (
                      booking.event_duration || 'N/A'
                    )}
                  </TableCell>
                  <TableCell>{booking.number_of_guests}</TableCell>
                  <TableCell>{booking.needs_equipment ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      defaultValue={booking.rate_per_hour || ''}
                      className="w-24"
                      onBlur={(e) => {
                        const rate = parseFloat(e.target.value);
                        if (!isNaN(rate)) {
                          handleRateUpdate(booking.id, rate);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      defaultValue={booking.equipment_cost || ''}
                      className="w-24"
                      onBlur={(e) => {
                        const cost = parseFloat(e.target.value);
                        if (!isNaN(cost)) {
                          handleEquipmentCostUpdate(booking.id, cost);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {booking.total_amount ? `$${booking.total_amount.toFixed(2)}` : '-'}
                  </TableCell>
                </TableRow>
              ))}
              {(!bookings || bookings.length === 0) && (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-4">
                    No booking requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default BookingManagement;