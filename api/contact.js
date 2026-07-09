import { createElement as h } from 'react'
import AutoReplyEmail from '../emails/templates/AutoReplyEmail.js'
import ContactFormEmail from '../emails/templates/ContactFormEmail.js'
import { pacificTimestamp, sendAutoReply, sendNotification } from '../emails/send.js'

const str = (v, max = 2000) => String(v ?? '').trim().slice(0, max)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const name = str(req.body.name, 120)
  const email = str(req.body.email, 200)
  const phone = str(req.body.phone, 40)
  const subject = str(req.body.subject, 200)
  const message = str(req.body.message, 5000)

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' })
  }

  try {
    const { error } = await sendNotification({
      subject: subject ? `[Website] ${subject}` : `[Website] New message from ${name}`,
      react: h(ContactFormEmail, {
        name,
        email,
        phone,
        subject,
        message,
        submittedAt: pacificTimestamp(),
      }),
      replyTo: email,
    })
    if (error) throw error

    // Best effort — a failed confirmation must not fail the submission.
    try {
      await sendAutoReply({
        to: email,
        subject: "We've received your message — PantherCreek Physical Therapy",
        react: h(AutoReplyEmail, {
          firstName: name.split(' ')[0],
          heading: "We've Received Your Message",
          message:
            "Thanks for reaching out to PantherCreek Physical Therapy & Balance. We've received your message and will be back with you soon.",
        }),
      })
    } catch (e) {
      console.error('Auto-reply error:', e)
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Resend error:', err)
    return res.status(500).json({ error: 'Failed to send message. Please try again.' })
  }
}
