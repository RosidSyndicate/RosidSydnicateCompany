import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, company, email, phone, inquiryType, message, honeypot, turnstileToken } = req.body || {}

    // Basic spam protection (honeypot)
    if (honeypot) {
      return res.status(200).json({ success: true, message: 'Message sent successfully.' })
    }

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields (Name, Email, Message)' })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' })
    }

    // Verify Turnstile Token (if configured with non-dummy key)
    const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA'
    if (turnstileToken && TURNSTILE_SECRET && TURNSTILE_SECRET !== '1x0000000000000000000000000000000AA') {
      try {
        const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
        console.warn('Turnstile Verification Notice:', err)
      }
    }

    // Connect to Supabase
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://mlfakixbqzgttwzqinvl.supabase.co'
    const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sZmFraXhicXpndHR3enFpbnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MzUyNjAsImV4cCI6MjEwMzMxMTI2MH0.NVFZYl5sMuYa-mWMt7In-MqGSCVvLRf-KUOFn9eIJJk'

    if (SUPABASE_URL && SUPABASE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
      const { error: dbError } = await supabase.from('inquiries').insert({
        inquiry_type: inquiryType || 'General Inquiry',
        name,
        company_name: company || '',
        email,
        phone: phone || '',
        subject: inquiryType || 'Website Contact Form',
        message,
        status: 'New'
      })
      if (dbError) {
        console.error('Supabase Insert Notice:', dbError.message)
      }
    }

    // Optional Email Notification via Resend
    const API_KEY = process.env.RESEND_API_KEY
    const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'admin.rosid@gmail.com'

    if (API_KEY && CONTACT_EMAIL) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Rosid Portal <onboarding@resend.dev>',
            to: [CONTACT_EMAIL],
            subject: `New Inquiry: ${inquiryType || 'General'} from ${name}`,
            html: `
              <h3>New Inquiry via Rosid Syndicates Group Website</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Company:</strong> ${company || 'N/A'}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
              <p><strong>Inquiry Type:</strong> ${inquiryType || 'General'}</p>
              <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
            `
          })
        })
      } catch (emailErr) {
        console.warn('Resend Email Notice:', emailErr)
      }
    }

    return res.status(200).json({ success: true, message: 'Message sent successfully.' })
  } catch (error) {
    console.error('Contact Handler Error:', error)
    return res.status(500).json({ error: 'An unexpected error occurred.' })
  }
}
