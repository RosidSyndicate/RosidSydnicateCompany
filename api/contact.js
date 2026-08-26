import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, company, email, phone, inquiryType, message, honeypot, turnstileToken } = req.body

    // Basic spam protection (honeypot)
    if (honeypot) {
      // Silently accept but don't process spam
      return res.status(200).json({ success: true, message: 'Message sent successfully.' })
    }

    if (!name || !email || !message || !inquiryType || !turnstileToken) {
      return res.status(400).json({ error: 'Missing required fields or security token' })
    }

    // Verify Turnstile Token
    const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA'
    
    try {
      const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: TURNSTILE_SECRET,
          response: turnstileToken,
        }).toString(),
      })
      
      const turnstileData = await turnstileRes.json()
      
      if (!turnstileData.success) {
        return res.status(403).json({ error: 'Security verification failed. Please try again.' })
      }
    } catch (err) {
      console.error('Turnstile Verification Error:', err)
      return res.status(500).json({ error: 'Security service unavailable.' })
    }

    // Email validation basic
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' })
    }

    const API_KEY = process.env.RESEND_API_KEY
    const CONTACT_EMAIL = process.env.CONTACT_EMAIL
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL
    const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY // or service key

    if (SUPABASE_URL && SUPABASE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
      const { error: dbError } = await supabase.from('inquiries').insert({
        inquiry_type: 'contact',
        name,
        company_name: company,
        email,
        phone,
        subject: inquiryType,
        message
      })
      if (dbError) {
        console.error('Supabase Insert Error:', dbError)
        // We continue to send email even if DB fails, as a fallback
      }
    }

    if (!API_KEY || !CONTACT_EMAIL) {
      if (process.env.NODE_ENV === 'production') {
        console.error('CRITICAL: Missing email production credentials.')
        return res.status(500).json({ error: 'System configuration error. Message cannot be delivered.' })
      }
      
      console.log('Mocking email delivery since RESEND_API_KEY or CONTACT_EMAIL is missing in dev.', {
        name, company, email, phone, inquiryType, message
      })
      return res.status(200).json({ success: true, message: 'Message sent successfully (Mocked).' })
    }

    // Real API integration (e.g., using Resend)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Contact Form <onboarding@resend.dev>',
        to: [CONTACT_EMAIL],
        subject: `New Inquiry: ${inquiryType} from ${name}`,
        html: `
          <h3>New Inquiry via Rosid Syndicates Group Website</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Company:</strong> ${company || 'N/A'}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
          <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
        `
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Email API Error:', errorData)
      return res.status(500).json({ error: 'Failed to send message. Please try again later.' })
    }

    return res.status(200).json({ success: true, message: 'Message sent successfully.' })
  } catch (error) {
    console.error('Server Error:', error)
    return res.status(500).json({ error: 'An unexpected error occurred.' })
  }
}
