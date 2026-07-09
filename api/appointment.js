import { createElement as h } from 'react'
import AppointmentRequestEmail from '../emails/templates/AppointmentRequestEmail.js'
import AutoReplyEmail from '../emails/templates/AutoReplyEmail.js'
import { pacificTimestamp, sendAutoReply, sendNotification } from '../emails/send.js'

const str = (v, max = 2000) => String(v ?? '').trim().slice(0, max)

/** "2026-07-15" → "Wed, Jul 15, 2026" (falls back to the raw value). */
function formatDate(raw) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
  const d = new Date(`${raw}T12:00:00Z`)
  if (Number.isNaN(d.getTime())) return raw
  return d.toLocaleDateString('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const firstName = str(req.body.fname, 120)
  const lastName = str(req.body.lname, 120)
  const email = str(req.body.email, 200)
  const phone = str(req.body.phone, 40)

  if (!firstName || !lastName || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone are required.' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Enter a valid email address.' })
  }

  const time = str(req.body.time, 20)
  const program = str(req.body.program, 60)
  const trainingFormat = str(req.body.format, 60)
  const tags = [program, trainingFormat].filter(Boolean).join(' · ')
  // Some pages send lowercase option values ("clackamas", "morning")
  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

  try {
    const { error } = await sendNotification({
      subject: `New Appointment Request — ${firstName} ${lastName}${tags ? ` (${tags})` : ''}`,
      react: h(AppointmentRequestEmail, {
        firstName,
        lastName,
        email,
        phone,
        location: cap(str(req.body.location, 80)),
        preferredDate: formatDate(str(req.body.date, 40)),
        preferredTime: cap(time),
        program,
        trainingFormat,
        athleteName: str(req.body.athleteName, 120),
        athleteAge: str(req.body.athleteAge, 10),
        submittedAt: pacificTimestamp(),
      }),
      replyTo: email,
    })
    if (error) throw error

    // Best effort — a failed confirmation must not fail the submission.
    try {
      await sendAutoReply({
        to: email,
        subject: "We've received your appointment request — PantherCreek Physical Therapy",
        react: h(AutoReplyEmail, {
          firstName,
          heading: "We've Received Your Request",
          message:
            'Thanks for requesting an appointment with PantherCreek Physical Therapy & Balance. This is a request only for now — our team will call you soon to confirm your time or suggest alternate availability.',
        }),
      })
    } catch (e) {
      console.error('Auto-reply error:', e)
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Resend error:', err)
    return res.status(500).json({ error: 'Failed to send request. Please try again or call us directly.' })
  }
}
