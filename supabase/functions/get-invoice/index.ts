import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    const url = new URL(req.url)
    const bookingId = url.searchParams.get('id')

    if (!bookingId) {
      throw new Error('Booking ID is required')
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Fetch booking details
    const { data: booking, error } = await supabase
      .from('dj_bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (error) throw error
    if (!booking) throw new Error('Booking not found')

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)
    }

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatTime = (time: string) => {
      return new Date(time).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      })
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>DJ Services Invoice - ${booking.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 20px;
            }
            .invoice-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 40px;
            }
            .section {
              margin-bottom: 30px;
            }
            .section h2 {
              color: #2563eb;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th, td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
            }
            th {
              background-color: #f8fafc;
            }
            .total {
              text-align: right;
              font-size: 1.2em;
              font-weight: bold;
              margin-top: 20px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #6b7280;
              font-size: 0.9em;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>DJ Services Invoice</h1>
            <p>Invoice #${booking.id.slice(0, 8)}</p>
          </div>

          <div class="invoice-details">
            <div>
              <h3>Bill To:</h3>
              <p>${booking.name}</p>
              ${booking.email ? `<p>Email: ${booking.email}</p>` : ''}
              ${booking.phone ? `<p>Phone: ${booking.phone}</p>` : ''}
            </div>
            <div>
              <h3>Event Details:</h3>
              <p>Date: ${formatDate(booking.event_date)}</p>
              <p>Time: ${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}</p>
              <p>Type: ${booking.event_type}</p>
              <p>Guests: ${booking.number_of_guests}</p>
            </div>
          </div>

          <div class="section">
            <h2>Services & Equipment</h2>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>DJ Services (${booking.event_duration})</td>
                  <td>${formatCurrency(booking.rate_per_hour)} per hour</td>
                  <td>${formatCurrency(booking.rate_per_hour * (booking.event_duration ? parseInt(booking.event_duration) : 0))}</td>
                </tr>
                ${booking.needs_equipment ? `
                <tr>
                  <td>Equipment Package${booking.equipment_details ? `: ${booking.equipment_details}` : ''}</td>
                  <td>Flat Rate</td>
                  <td>${formatCurrency(booking.equipment_cost || 0)}</td>
                </tr>
                ` : ''}
              </tbody>
            </table>

            <div class="total">
              Total Amount: ${formatCurrency(booking.total_amount || 0)}
            </div>
          </div>

          <div class="section">
            <h2>Payment Details</h2>
            <p>Please make payment to:</p>
            <p>Bank: [Bank Name]</p>
            <p>Account: [Account Number]</p>
            <p>Due Date: [Due Date]</p>
          </div>

          <div class="footer">
            <p>Thank you for choosing our DJ services!</p>
            <p>If you have any questions about this invoice, please contact us.</p>
          </div>
        </body>
      </html>
    `

    return new Response(html, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})