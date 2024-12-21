import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import Index from "./pages/Index";
import { Auth } from "@/components/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import EventManagement from "./pages/EventManagement";
import RsvpManagement from "./pages/RsvpManagement";
import ProductManagement from "./pages/ProductManagement";
import BookingManagement from "./pages/BookingManagement";
import SignContract from "./pages/SignContract";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Auth />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/events" element={<EventManagement />} />
            <Route path="/admin/rsvps" element={<RsvpManagement />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/bookings" element={<BookingManagement />} />
            <Route path="/sign-contract/:bookingId" element={<SignContract />} />
            <Route path="/" element={<Index />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;