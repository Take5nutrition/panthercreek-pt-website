import { Button, Section } from '@react-email/components'
import { colors } from '../theme'

export interface ActionButtonsProps {
  /** Lead's email — renders the "Reply" button. */
  email?: string | null
  /** Lead's phone — renders the "Call" button when present. */
  phone?: string | null
  /** First name used in button labels, e.g. "Call Jane". */
  name?: string | null
  /** Pre-filled subject for the mailto reply link. */
  replySubject?: string
}

/**
 * Quick-action buttons for following up on a lead. Buttons only render
 * when their underlying contact info exists.
 */
export default function ActionButtons({ email, phone, name, replySubject }: ActionButtonsProps) {
  const telHref = phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : null
  const mailHref = email
    ? `mailto:${email}${replySubject ? `?subject=${encodeURIComponent(replySubject)}` : ''}`
    : null

  if (!mailHref && !telHref) return null

  return (
    <Section style={wrap}>
      {mailHref && (
        <Button href={mailHref} style={primary}>
          Reply to {name || 'Lead'}
        </Button>
      )}
      {telHref && (
        <Button href={telHref} style={secondary}>
          Call {name || 'Now'}
        </Button>
      )}
    </Section>
  )
}

const wrap = {
  padding: '6px 0 18px',
  textAlign: 'center' as const,
}

const buttonBase = {
  borderRadius: '8px',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: 700,
  letterSpacing: '0.5px',
  padding: '12px 22px',
  margin: '4px 6px',
  textDecoration: 'none',
}

const primary = {
  ...buttonBase,
  backgroundColor: colors.signal,
  color: colors.white,
}

const secondary = {
  ...buttonBase,
  backgroundColor: colors.navy,
  color: colors.white,
}
