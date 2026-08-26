import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { 
      companyName, country, contactPerson, email, phone, 
      tenderName, tenderRef, projectSector, bidDeadline, 
      requiredSupport, message, honeypot, attachment, turnstileToken 
    } = req.body

    // Basic spam protection (honeypot)
    if (honeypot) {
      return res.status(200).json({ success: true, message: 'Message sent successfully.' })
    }

    if (!companyName || !country || !contactPerson || !email || !turnstileToken) {
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' })
    }

    // Attachment validation (server-side)
    let attachments = []
    if (attachment && attachment.content && attachment.filename) {
      // Validate filename extension safely
      const ext = attachment.filename.split('.').pop().toLowerCase()
      if (!['pdf', 'docx', 'xlsx'].includes(ext)) {
        return res.status(400).json({ error: 'Invalid file type. Only PDF, DOCX, and XLSX allowed.' })
      }
      
      // Rough size check on base64 string (3MB limit roughly)
      if (attachment.content.length > 4 * 1024 * 1024) {
        return res.status(400).json({ error: 'File size too large.' })
      }

      attachments.push({
        filename: attachment.filename,
        content: attachment.content
      })
    }

    const API_KEY = process.env.RESEND_API_KEY
    const CONTACT_EMAIL = process.env.CONTACT_EMAIL
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL
    const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY

    if (SUPABASE_URL && SUPABASE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
      const { error: dbError } = await supabase.from('inquiries').insert({
        inquiry_type: 'tender',
        name: contactPerson,
        company_name: companyName,
        email,
        phone,
        subject: tenderName || 'Tender Inquiry',
        message,
        tender_reference: tenderRef,
        project_sector: projectSector,
        bid_deadline: bidDeadline,
        required_support: requiredSupport ? [requiredSupport] : []
      })
      if (dbError) {
        console.error('Supabase Insert Error:', dbError)
      }
    }

    if (!API_KEY || !CONTACT_EMAIL) {
      if (process.env.NODE_ENV === 'production') {
        console.error('CRITICAL: Missing email production credentials for tender API.')
        return res.status(500).json({ error: 'System configuration error. Message cannot be delivered.' })
      }
      
      console.log('Mocking tender delivery since credentials are missing in dev.')
      return res.status(200).json({ success: true, message: 'Message sent successfully (Mocked).' })
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Tender Inquiry <onboarding@resend.dev>',
        to: [CONTACT_EMAIL],
        subject: `New Tender Inquiry: ${companyName}`,
        html: `
          <h3>New Tender / RFQ Inquiry</h3>
          <p><strong>Company Name:</strong> ${companyName}</p>
          <p><strong>Country:</strong> ${country}</p>
          <p><strong>Contact Person:</strong> ${contactPerson}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <hr/>
          <p><strong>Tender/Project Name:</strong> ${tenderName || 'N/A'}</p>
          <p><strong>Tender Reference:</strong> ${tenderRef || 'N/A'}</p>
          <p><strong>Project Sector:</strong> ${projectSector || 'N/A'}</p>
          <p><strong>Bid Deadline:</strong> ${bidDeadline || 'N/A'}</p>
          <p><strong>Required Support:</strong> ${requiredSupport || 'N/A'}</p>
          <hr/>
          <p><strong>Message:</strong><br/>${(message || 'No additional message.').replace(/\n/g, '<br/>')}</p>
          <p><em>${attachments.length > 0 ? 'Document attached.' : 'No document attached.'}</em></p>
        `,
        attachments: attachments.length > 0 ? attachments : undefined
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
