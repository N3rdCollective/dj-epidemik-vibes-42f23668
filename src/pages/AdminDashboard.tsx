import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RsvpsTable } from "@/components/admin/RsvpsTable";

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

  if (!user || !isAdmin) return null;

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleBackToSite}>Back to Website</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Content Management</h2>
          <p className="text-gray-600 mb-4">Manage your website content</p>
        </Card>
        <Card className="p-6 cursor-pointer" onClick={handleNavigateToEvents}>
          <h2 className="text-2xl font-semibold mb-4">Event Management</h2>
          <p className="text-gray-600 mb-4">Manage your events and calendar</p>
          <Button>View Events</Button>
        </Card>
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">User Management</h2>
          <p className="text-gray-600 mb-4">Manage user accounts and permissions</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Event RSVPs</h2>
        <RsvpsTable />
      </Card>
    </div>
  );
};

export default AdminDashboard;