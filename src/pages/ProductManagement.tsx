import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/form/ProductForm";

const ProductManagement = () => {
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
        <h1 className="text-4xl font-bold">Product Management</h1>
        <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
      </div>
      
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Create New Product</h2>
        <ProductForm />
      </Card>
    </div>
  );
};

export default ProductManagement;