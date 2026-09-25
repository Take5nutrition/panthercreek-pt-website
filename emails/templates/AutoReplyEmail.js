import { createElement as h } from 'react'
import { Text } from '@react-email/components'
import EmailLayout from '../components/EmailLayout.js'
import { colors } from '../theme.js'

const CLINIC_PHONE = '(503) 698-5500'

/**
 * Client-facing confirmation sent to the person who submitted a form —
 * warm, brief, and on-brand, with the clinic phone number for anything
 * urgent.
 *
 * @param {object} props
 * @param {string} props.firstName  Submitter's first name for the greeting.
 * @param {string} props.heading    e.g. "We've Received Your Message".
 * @param {string} props.message    One-paragraph confirmation body.
 */
export default function AutoReplyEmail({ firstName, heading, message }) {
  return h(EmailLayout, {
    preview: message,
    eyebrow: 'Thank You',
    heading,
  },
    h(Text, { style: paragraph }, `Hi ${firstName},`),
    h(Text, { style: paragraph }, message),
    h(Text, { style: paragraph },
      "If you need anything right away, we're here to help."),
    h(Text, { style: notice },
      `To cancel or change an existing appointment, please call ${CLINIC_PHONE}. `
      + 'Website messages and appointment requests do not cancel appointments. '
      + 'If you call outside office hours, please leave a voicemail.'),
    h(Text, { style: signoff }, '— The PantherCreek Team'),
  )
}

const paragraph = {
  color: colors.ink,
  fontSize: '15px',
  lineHeight: '1.7',
  margin: '0 0 16px',
}

const notice = {
  color: colors.ink,
  fontSize: '14px',
  lineHeight: '1.65',
  margin: '0 0 16px',
  padding: '12px 14px',
  background: '#FFF9E8',
  border: '1px solid rgba(140,172,23,.4)',
  borderRadius: '6px',
}

const signoff = {
  color: colors.muted,
  fontSize: '15px',
  fontWeight: 700,
  margin: '8px 0 18px',
}

/** Sample data for previews (`npm run email:preview`). */
AutoReplyEmail.PreviewProps = {
  firstName: 'Jane',
  heading: "We've Received Your Request",
  message:
    "Thanks for requesting an appointment with PantherCreek Physical Therapy & Balance. Our team will call you soon to confirm your time or suggest alternate availability.",
}
