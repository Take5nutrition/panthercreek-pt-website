import { render } from '@react-email/components'
import { Resend } from 'resend'

const FROM = 'PantherCreek PT Website <noreply@panthercreekpt.com>'
/** Friendlier display name for client-facing auto-replies. */
const FROM_FRIENDLY = 'PantherCreek Physical Therapy <noreply@panthercreekpt.com>'

/**
 * Who gets appointment requests and contact-form messages. Used when
 * NOTIFY_TO is unset — set that env var in Vercel (comma-separated) to
 * change the list without a redeploy.
 */
const DEFAULT_NOTIFY_TO = [
  'kristina.h@panthercreekpt.com',
  'jessica.s@panthercreekpt.com',
  'Info@panthercreekpt.com',
]

/** Where replies to client-facing auto-replies land. Always one address. */
const REPLY_TO = 'Info@panthercreekpt.com'

/**
 * Notification recipients: NOTIFY_TO if set and usable, else DEFAULT_NOTIFY_TO.
 *
 * Read per call rather than at module load so an env var change takes effect
 * on the next request instead of the next cold start. Resend caps a single
 * send at 50 recipients; case is preserved but duplicates are folded.
 */
function notifyRecipients() {
  const configured = String(process.env.NOTIFY_TO ?? '')
    .split(/[,;\s]+/)
    .map((address) => address.trim())
    .filter((address) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address))

  const seen = new Set()
  return (configured.length ? configured : DEFAULT_NOTIFY_TO)
    .filter((address) => {
      const key = address.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .slice(0, 50)
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
    to: notifyRecipients(),
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
    replyTo: REPLY_TO,
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
