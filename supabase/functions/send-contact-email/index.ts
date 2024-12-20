import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Checking Resend API key configuration...');
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set in environment variables');
      throw new Error('Email service configuration is missing. Please set the RESEND_API_KEY in Edge Function secrets.');
    }

    if (!RESEND_API_KEY.startsWith('re_')) {
      console.error('Invalid Resend API key format');
      throw new Error('Invalid API key format. Please ensure you\'ve copied the correct Resend API key.');
    }

    const formData: ContactFormData = await req.json()
    console.log('Received contact form submission:', formData)

    const emailData = {
      from: 'DJ Epidemik <info@djepidemik.com>', // Updated from address
      to: ['info@djepidemik.com'], // Updated to address
      reply_to: formData.email,
      subject: `New Contact Form Submission: ${formData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${formData.name} (${formData.email})</p>
        <p><strong>Subject:</strong> ${formData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message}</p>
      `,
    };

    console.log('Attempting to send email with Resend API...');

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailData),
    })

    const responseData = await res.json()
    console.log('Resend API response:', responseData)

    if (!res.ok) {
      console.error('Error from Resend API:', responseData)
      throw new Error(responseData.message || 'Failed to send email')
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in send-contact-email function:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined,
        tip: 'Please verify that the Resend API key is correctly set in the Edge Function secrets'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
}

serve(handler)