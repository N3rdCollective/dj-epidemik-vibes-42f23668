import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { RsvpsTable } from "@/components/admin/RsvpsTable";

const RsvpManagement = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!isAdmin) {
      navigate("/");
    }
  }, [user, isAdmin, navigate]);

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-foreground">RSVP Management</h1>
        <Button 
          variant="outline"
          className="border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={handleBackToDashboard}
        >
          Back to Dashboard
        </Button>
      </div>

      <div className="bg-muted rounded-lg shadow-lg p-6 border border-border">
        <RsvpsTable />
      </div>
    </div>
  );
};

export default RsvpManagement;