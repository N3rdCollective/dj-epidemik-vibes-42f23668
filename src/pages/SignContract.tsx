import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SignContract = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

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
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.strokeStyle = '#000';
        context.lineWidth = 2;
        setCtx(context);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctx) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const submitSignature = async () => {
    if (!canvasRef.current || !booking) return;
    
    try {
      const signatureData = canvasRef.current.toDataURL();
      
      const response = await supabase.functions.invoke('submit-signature', {
        body: {
          signature: signatureData,
          bookingId: booking.id,
          email: booking.email
        }
      });

      if (response.error) throw response.error;

      toast.success('Contract signed successfully!');
    } catch (error) {
      console.error('Error submitting signature:', error);
      toast.error('Failed to submit signature');
    }
  };

  if (isLoading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (!booking) return <div className="container mx-auto px-4 py-8">Booking not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Sign Contract</h1>
        <div className="mb-4">
          <p><strong>Event:</strong> {booking.event_type}</p>
          <p><strong>Date:</strong> {new Date(booking.event_date).toLocaleDateString()}</p>
          <p><strong>Client:</strong> {booking.name}</p>
        </div>
        
        <div className="border rounded p-4 mb-4">
          <p className="mb-2">Please sign below:</p>
          <canvas
            ref={canvasRef}
            className="border w-full h-40 mb-2"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearSignature}>Clear</Button>
            <Button onClick={submitSignature}>Submit Signature</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SignContract;