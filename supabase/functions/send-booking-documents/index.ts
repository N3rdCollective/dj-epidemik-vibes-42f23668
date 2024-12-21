import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BookingData {
  name: string;
  email: string;
  event_date: string;
  event_type: string;
  start_time: string;
  end_time: string;
  rate_per_hour: number;
  equipment_cost: number;
  total_amount: number;
  needs_equipment: boolean;
  equipment_details?: string;
}

const generateInvoiceHtml = (booking: BookingData) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <h1>DJ Epidemik - Invoice</h1>
      <hr />
      <div style="margin: 20px 0;">
        <h3>Client Information</h3>
        <p>Name: ${booking.name}</p>
        <p>Email: ${booking.email}</p>
      </div>
      <div style="margin: 20px 0;">
        <h3>Event Details</h3>
        <p>Date: ${new Date(booking.event_date).toLocaleDateString()}</p>
        <p>Type: ${booking.event_type}</p>
        <p>Time: ${new Date(booking.start_time).toLocaleTimeString()} - ${new Date(booking.end_time).toLocaleTimeString()}</p>
      </div>
      <div style="margin: 20px 0;">
        <h3>Costs Breakdown</h3>
        <p>Rate per Hour: $${booking.rate_per_hour}</p>
        <p>Equipment Cost: $${booking.equipment_cost}</p>
        <p><strong>Total Amount: $${booking.total_amount}</strong></p>
      </div>
    </div>
  `;
};

const generateContractHtml = (booking: BookingData) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <h1>DJ Services Agreement</h1>
      <hr />
      <p>This agreement is made between DJ Epidemik ("the DJ") and ${booking.name} ("the Client") for DJ services at the following event:</p>
      
      <h3>Event Details</h3>
      <ul>
        <li>Date: ${new Date(booking.event_date).toLocaleDateString()}</li>
        <li>Event Type: ${booking.event_type}</li>
        <li>Time: ${new Date(booking.start_time).toLocaleTimeString()} - ${new Date(booking.end_time).toLocaleTimeString()}</li>
      </ul>

      <h3>Services & Fees</h3>
      <ul>
        <li>Rate per Hour: $${booking.rate_per_hour}</li>
        <li>Equipment: ${booking.needs_equipment ? 'Provided by DJ' : 'Not Required'}</li>
        ${booking.equipment_details ? `<li>Equipment Details: ${booking.equipment_details}</li>` : ''}
        <li>Equipment Cost: $${booking.equipment_cost}</li>
        <li><strong>Total Fee: $${booking.total_amount}</strong></li>
      </ul>

      <h3>Terms & Conditions</h3>
      <ol>
        <li>A 50% deposit is required to secure the booking.</li>
        <li>The remaining balance is due on the day of the event.</li>
        <li>Cancellations must be made at least 30 days before the event.</li>
      </ol>
    </div>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Checking Resend API key configuration...');
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set in environment variables');
      throw new Error('Email service configuration is missing');
    }

    const { booking, documentType } = await req.json();
    console.log('Received request to send', documentType, 'for booking:', booking);

    const html = documentType === 'invoice' 
      ? generateInvoiceHtml(booking)
      : generateContractHtml(booking);

    const subject = documentType === 'invoice' 
      ? 'Your DJ Booking Invoice' 
      : 'DJ Services Agreement';

    const emailData = {
      from: 'DJ Epidemik <info@djepidemik.com>',
      to: [booking.email],
      subject,
      html,
    };

    console.log('Sending email with', documentType);
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailData),
    });

    const responseData = await res.json();
    console.log('Resend API response:', responseData);

    if (!res.ok) {
      throw new Error(responseData.message || 'Failed to send email');
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in send-booking-documents function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
};

serve(handler);