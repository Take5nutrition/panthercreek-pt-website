import { render } from '@react-email/components'
import { Resend } from 'resend'

const FROM = 'PantherCreek PT Website <noreply@panthercreekpt.com>'
/** Friendlier display name for client-facing auto-replies. */
const FROM_FRIENDLY = 'PantherCreek Physical Therapy <noreply@panthercreekpt.com>'
const TO = 'tatumerickson@panthercreekpt.com'

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
 *
 * @param {{ subject: string, react: import('react').ReactElement, replyTo?: string }} options
 */
export async function sendNotification({ subject, react, replyTo }) {
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

/**
 * Sends a client-facing confirmation to the person who submitted a form.
 * Replies to this email go to the clinic inbox, not the noreply address.
 *
 * @param {{ to: string, subject: string, react: import('react').ReactElement }} options
 */
export async function sendAutoReply({ to, subject, react }) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const [html, text] = await Promise.all([
    render(react),
    render(react, { plainText: true }),
  ])

  return resend.emails.send({
    from: FROM_FRIENDLY,
    to,
    subject,
    html,
    text,
    replyTo: TO,
  })
}

/** Current time formatted for Pacific (e.g. "Wed, Jul 8, 2026, 5:45 PM PT"). */
export function pacificTimestamp() {
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
