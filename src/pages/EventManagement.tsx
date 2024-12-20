import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

const EventManagement = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!isAdmin) {
      navigate("/");
    }
  }, [user, isAdmin, navigate]);

  const { data: events, refetch } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      console.log('Fetching all events for admin...');
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true });
      
      if (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
        throw error;
      }

      console.log('Fetched events:', data);
      return data || [];
    },
  });

  const toggleEventVisibility = async (eventId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('events')
      .update({ is_live: !currentStatus })
      .eq('id', eventId);

    if (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event visibility');
      return;
    }

    toast.success('Event visibility updated');
    refetch();
  };

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Event Management</h1>
        <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events?.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>
                    {format(new Date(event.start_time), 'MMM dd yyyy')}
                  </TableCell>
                  <TableCell>{event.venue}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>
                    {event.is_imported ? 'Camelo' : 'Manual'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={event.is_live}
                        onCheckedChange={() => toggleEventVisibility(event.id, event.is_live)}
                      />
                      <span>{event.is_live ? 'Live' : 'Draft'}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default EventManagement;