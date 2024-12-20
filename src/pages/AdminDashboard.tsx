import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import type { Event } from "@/types/event";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [editingEvent, setEditingEvent] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!isAdmin) {
      navigate("/");
    }
  }, [user, isAdmin, navigate]);

  const { data: events, refetch } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("start_time", { ascending: true });

      if (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events");
        throw error;
      }

      return data as Event[];
    },
  });

  const toggleEventLive = async (eventId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("events")
      .update({ is_live: !currentStatus })
      .eq("id", eventId);

    if (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event status");
      return;
    }

    toast.success("Event status updated successfully");
    refetch();
  };

  const updateEventPackages = async (eventId: string, packages: any) => {
    const { error } = await supabase
      .from("events")
      .update({ packages })
      .eq("id", eventId);

    if (error) {
      console.error("Error updating event packages:", error);
      toast.error("Failed to update event packages");
      return;
    }

    toast.success("Event packages updated successfully");
    setEditingEvent(null);
    refetch();
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <Link to="/">
          <Button variant="outline">Back to Website</Button>
        </Link>
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Event Management</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events?.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    {format(new Date(event.start_time), "MMM dd yyyy")}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.venue}</p>
                    </div>
                  </TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>
                    <span className="capitalize">{event.type}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={event.is_live}
                        onCheckedChange={() =>
                          toggleEventLive(event.id, event.is_live)
                        }
                      />
                      <span>{event.is_live ? "Live" : "Draft"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {event.type === "packages" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setEditingEvent(
                            editingEvent === event.id ? null : event.id
                          )
                        }
                      >
                        {editingEvent === event.id
                          ? "Cancel Edit"
                          : "Edit Packages"}
                      </Button>
                    )}
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

export default AdminDashboard;