import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { format } from "date-fns";

const SignContract = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        console.log('Fetching booking with ID:', bookingId);
        const { data, error } = await supabase
          .from('dj_bookings')
          .select('*')
          .eq('id', bookingId)
          .single();

        if (error) {
          console.error('Error fetching booking:', error);
          throw error;
        }

        console.log('Fetched booking:', data);
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
        setError('Failed to load booking details. Please try again later.');
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const submitSignature = async () => {
    if (!booking || !canvasRef.current) {
      toast.error('Please add your signature before submitting');
      return;
    }
    
    try {
      setSigning(true);
      const signatureData = canvasRef.current.toDataURL();
      
      const { data: ipData } = await fetch('https://api.ipify.org?format=json').then(res => res.json());
      
      const { error } = await supabase
        .from('contract_signatures')
        .insert({
          booking_id: bookingId,
          signature: signatureData,
          signer_email: booking.email,
          signer_ip: ipData?.ip,
          status: 'signed'
        });

      if (error) throw error;
      
      toast.success('Contract signed successfully');
      navigate('/'); // Redirect to home page after successful signing
    } catch (error) {
      console.error('Error submitting signature:', error);
      toast.error('Failed to submit signature');
    } finally {
      setSigning(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error || 'Booking not found'}</p>
          <Button className="mt-4" onClick={() => navigate('/')}>Return Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Sign Contract</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Booking Details</h2>
          <div className="space-y-2 text-gray-600">
            <p><span className="font-medium">Event:</span> {booking.event_type}</p>
            <p><span className="font-medium">Date:</span> {booking.event_date ? format(new Date(booking.event_date), 'MMMM d, yyyy') : 'Not specified'}</p>
            <p><span className="font-medium">Time:</span> {booking.start_time ? format(new Date(booking.start_time), 'h:mm a') : 'Not specified'} - {booking.end_time ? format(new Date(booking.end_time), 'h:mm a') : 'Not specified'}</p>
            <p><span className="font-medium">Client:</span> {booking.name}</p>
            <p><span className="font-medium">Total Amount:</span> ${booking.total_amount}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Terms & Conditions</h2>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <p>1. The DJ will arrive at least 1 hour before the event start time for setup.</p>
            <p>2. A 50% deposit is required to secure the booking.</p>
            <p>3. The remaining balance is due on or before the event date.</p>
            <p>4. Cancellation policy: Full refund if cancelled 30 days before the event.</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Sign Below</h2>
          <p className="text-sm text-gray-500 mb-4">Please sign using your mouse or finger to accept the terms and conditions.</p>
          <div className="border border-gray-300 rounded-lg p-2">
            <canvas
              ref={canvasRef}
              width={500}
              height={200}
              className="border border-gray-200 rounded w-full touch-none bg-white"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={clearSignature}>
            Clear Signature
          </Button>
          <Button onClick={submitSignature} disabled={signing}>
            {signing ? 'Submitting...' : 'Submit Signature'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SignContract;