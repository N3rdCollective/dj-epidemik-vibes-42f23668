import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Rsvp {
  id: string;
  event_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
}

export const RsvpsTable = ({ eventId }: { eventId?: string }) => {
  const { data: rsvps, isLoading } = useQuery({
    queryKey: ['rsvps', eventId],
    queryFn: async () => {
      console.log('Fetching RSVPs for event:', eventId);
      const query = supabase
        .from('rsvps')
        .select('*');
      
      if (eventId) {
        query.eq('event_id', eventId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching RSVPs:', error);
        throw error;
      }
      
      return data as Rsvp[];
    },
  });

  if (isLoading) {
    return <div>Loading RSVPs...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rsvps?.map((rsvp) => (
          <TableRow key={rsvp.id}>
            <TableCell>{rsvp.name}</TableCell>
            <TableCell>{rsvp.email || 'N/A'}</TableCell>
            <TableCell>{rsvp.phone || 'N/A'}</TableCell>
            <TableCell>
              {new Date(rsvp.created_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
        {!rsvps?.length && (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No RSVPs found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};