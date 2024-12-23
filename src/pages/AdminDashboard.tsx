import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!isAdmin) {
      navigate("/");
    }
  }, [user, isAdmin, navigate]);

  const handleBackToSite = () => {
    navigate('/');
  };

  const handleNavigateToEvents = () => {
    navigate('/admin/events');
  };

  const handleNavigateToRsvps = () => {
    navigate('/admin/rsvps');
  };

  const handleNavigateToProducts = () => {
    navigate('/admin/products');
  };

  const handleNavigateToBookings = () => {
    navigate('/admin/bookings');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Button onClick={handleBackToSite}>Back to Website</Button>
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Content Management</h2>
          <p className="text-gray-600 mb-4">Manage your website content</p>
        </Card>
        <Card className="p-6 cursor-pointer" onClick={handleNavigateToEvents}>
          <h2 className="text-2xl font-semibold mb-4">Event Management</h2>
          <p className="text-gray-600 mb-4">Manage your events and calendar</p>
          <Button>View Events</Button>
        </Card>
        <Card className="p-6 cursor-pointer" onClick={handleNavigateToRsvps}>
          <h2 className="text-2xl font-semibold mb-4">RSVP Management</h2>
          <p className="text-gray-600 mb-4">View and manage event RSVPs</p>
          <Button>View RSVPs</Button>
        </Card>
        <Card className="p-6 cursor-pointer" onClick={handleNavigateToBookings}>
          <h2 className="text-2xl font-semibold mb-4">Booking Management</h2>
          <p className="text-gray-600 mb-4">View and manage DJ booking requests</p>
          <Button>View Bookings</Button>
        </Card>
        <Card className="p-6 cursor-pointer" onClick={handleNavigateToProducts}>
          <h2 className="text-2xl font-semibold mb-4">Product Management</h2>
          <p className="text-gray-600 mb-4">Create and manage Stripe products</p>
          <Button>Manage Products</Button>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;