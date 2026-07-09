import type { ReactElement } from 'react'
import { render } from '@react-email/components'
import { Resend } from 'resend'

const FROM = 'PantherCreek PT Website <noreply@panthercreekpt.com>'
const TO = 'take5athletics@gmail.com'

interface SendNotificationOptions {
  subject: string
  /** React Email template element, e.g. <ContactFormEmail {...props} />. */
  react: ReactElement
  /** Lead's email so a plain "Reply" in the inbox goes straight to them. */
  replyTo?: string
}

/**
 * Sends an internal notification email via Resend.
 *
 * The template is rendered to HTML and plain text here, and Resend receives
 * plain strings. Do NOT pass the `react` prop to resend.emails.send —
 * resend's internal renderer is incompatible with @react-email/render v2
 * and throws "Failed to render React component" at runtime.
 *
 * The plain-text part comes from the same React template — multipart emails
 * score better with spam filters and stay readable in text-only clients.
 */
export async function sendNotification({ subject, react, replyTo }: SendNotificationOptions) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const [html, text] = await Promise.all([
    render(react),
    render(react, { plainText: true }),
  ])

  return resend.emails.send({
    from: FROM,
    to: TO,
    subject,
    html,
    text,
    replyTo,
  })
}

/** Current time formatted for Pacific (e.g. "Wed, Jul 8, 2026, 5:45 PM PT"). */
export function pacificTimestamp(): string {
  return `${new Date().toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })} PT`
}
