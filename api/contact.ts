import { createElement } from 'react'
import ContactFormEmail from '../emails/templates/ContactFormEmail'
import { pacificTimestamp, sendNotification } from '../emails/send'

/** Minimal Vercel function types — avoids pulling in @vercel/node. */
interface VercelRequest {
  method?: string
  body: Record<string, unknown>
}
interface VercelResponse {
  status(code: number): VercelResponse
  json(data: unknown): void
}

const str = (v: unknown, max = 2000) => String(v ?? '').trim().slice(0, max)

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
      react: createElement(ContactFormEmail, {
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

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Resend error:', err)
    return res.status(500).json({ error: 'Failed to send message. Please try again.' })
  }
}
