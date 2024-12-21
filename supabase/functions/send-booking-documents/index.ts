import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/@resend/node'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SITE_URL = Deno.env.get('SITE_URL') || 'http://localhost:5173'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { booking, documentType } = await req.json()
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)
    }

    const generateInvoiceHtml = (booking: any) => {
      const total = booking.total_amount || 0
      const rate = booking.rate_per_hour || 0
      const equipment = booking.equipment_cost || 0

      return `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #2563eb;">DJ Services Invoice</h1>
              
              <div style="margin-bottom: 30px;">
                <h2>Event Details</h2>
                <p><strong>Client:</strong> ${booking.name}</p>
                <p><strong>Date:</strong> ${new Date(booking.event_date).toLocaleDateString()}</p>
                <p><strong>Event Type:</strong> ${booking.event_type}</p>
                <p><strong>Location:</strong> TBD</p>
              </div>
              
              <div style="margin-bottom: 30px;">
                <h2>Services & Costs</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px 0;">DJ Services (Rate per Hour)</td>
                    <td style="text-align: right;">${formatCurrency(rate)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px 0;">Equipment</td>
                    <td style="text-align: right;">${formatCurrency(equipment)}</td>
                  </tr>
                  <tr style="font-weight: bold;">
                    <td style="padding: 10px 0;">Total</td>
                    <td style="text-align: right;">${formatCurrency(total)}</td>
                  </tr>
                </table>
              </div>
              
              <div style="margin-top: 30px; font-size: 0.9em; color: #666;">
                <p>Please make payment to: [Payment Details]</p>
                <p>Due date: [Due Date]</p>
              </div>
            </div>
          </body>
        </html>
      `
    }

    const generateContractHtml = (booking: any) => {
      const signatureUrl = `${SITE_URL}/sign-contract/${booking.id}`

      return `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #2563eb;">DJ Services Contract</h1>
              
              <div style="margin-bottom: 30px;">
                <h2>Event Details</h2>
                <p><strong>Client:</strong> ${booking.name}</p>
                <p><strong>Date:</strong> ${new Date(booking.event_date).toLocaleDateString()}</p>
                <p><strong>Event Type:</strong> ${booking.event_type}</p>
                <p><strong>Number of Guests:</strong> ${booking.number_of_guests}</p>
              </div>
              
              <div style="margin-bottom: 30px;">
                <h2>Terms & Conditions</h2>
                <p>1. The DJ will arrive 2 hours before the event start time for setup.</p>
                <p>2. The total fee for services is ${formatCurrency(booking.total_amount || 0)}.</p>
                <p>3. A deposit of 50% is required to secure the booking.</p>
                <p>4. Cancellation policy: [Details]</p>
              </div>
              
              <div style="margin-top: 30px;">
                <p>To sign this contract digitally, please click the link below:</p>
                <p><a href="${signatureUrl}" style="color: #2563eb;">Sign Contract</a></p>
              </div>
            </div>
          </body>
        </html>
      `
    }

    const html = documentType === 'invoice' 
      ? generateInvoiceHtml(booking)
      : generateContractHtml(booking)

    const subject = documentType === 'invoice' 
      ? 'Your DJ Services Invoice'
      : 'DJ Services Contract - Please Sign'

    const { error: emailError } = await resend.emails.send({
      from: 'DJ Services <onboarding@resend.dev>',
      to: booking.email,
      subject: subject,
      html: html
    })

    if (emailError) {
      console.error('Error sending email:', emailError)
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ message: 'Document sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})