import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const SignContract = () => {
  const { bookingId } = useParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data, error } = await supabase
          .from('dj_bookings')
          .select('*')
          .eq('id', bookingId)
          .single();

        if (error) throw error;
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
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
    if (!booking || !canvasRef.current) return;
    
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
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!booking) {
    return <div className="container mx-auto px-4 py-8">Booking not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Sign Contract</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Booking Details</h2>
          <p><strong>Event:</strong> {booking.event_type}</p>
          <p><strong>Date:</strong> {new Date(booking.event_date).toLocaleDateString()}</p>
          <p><strong>Client:</strong> {booking.name}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Sign Below</h2>
          <div className="border border-gray-300 rounded-lg p-2">
            <canvas
              ref={canvasRef}
              width={500}
              height={200}
              className="border border-gray-200 rounded w-full touch-none"
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