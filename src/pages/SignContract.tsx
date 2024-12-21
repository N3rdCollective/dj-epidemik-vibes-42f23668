import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { BookingDetails } from "@/components/contract/BookingDetails";
import { TermsAndConditions } from "@/components/contract/TermsAndConditions";
import { SignatureCanvas } from "@/components/contract/SignatureCanvas";

const SignContract = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signatureCanvas, setSignatureCanvas] = useState<HTMLCanvasElement | null>(null);

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

  const clearSignature = () => {
    if (signatureCanvas) {
      const ctx = signatureCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
      }
    }
  };

  const submitSignature = async () => {
    if (!booking || !signatureCanvas) {
      toast.error('Please add your signature before submitting');
      return;
    }
    
    try {
      setSigning(true);
      const signatureData = signatureCanvas.toDataURL();
      
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
      
      toast.success('Contract signed successfully! Redirecting...');
      setTimeout(() => navigate('/'), 2000); // Redirect after showing success message
    } catch (error) {
      console.error('Error submitting signature:', error);
      toast.error('Failed to submit signature');
    } finally {
      setSigning(false);
    }
  };

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
        
        <BookingDetails booking={booking} />
        <TermsAndConditions />

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Sign Below</h2>
          <p className="text-sm text-gray-500 mb-4">Please sign using your mouse or finger to accept the terms and conditions.</p>
          <div className="border border-gray-300 rounded-lg p-2">
            <SignatureCanvas onSignatureChange={setSignatureCanvas} />
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