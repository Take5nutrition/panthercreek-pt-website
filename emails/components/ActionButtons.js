import { createElement as h } from 'react'
import { Button, Section } from '@react-email/components'
import { colors } from '../theme.js'

/**
 * Quick-action buttons for following up on a lead. Buttons only render
 * when their underlying contact info exists.
 *
 * @param {{ email?: string|null, phone?: string|null, name?: string|null, replySubject?: string }} props
 */
export default function ActionButtons({ email, phone, name, replySubject }) {
  const telHref = phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : null
  const mailHref = email
    ? `mailto:${email}${replySubject ? `?subject=${encodeURIComponent(replySubject)}` : ''}`
    : null

  if (!mailHref && !telHref) return null

  return h(Section, { style: wrap },
    mailHref ? h(Button, { href: mailHref, style: primary }, `Reply to ${name || 'Lead'}`) : null,
    telHref ? h(Button, { href: telHref, style: secondary }, `Call ${name || 'Now'}`) : null,
  )
}

const wrap = {
  padding: '6px 0 18px',
  textAlign: 'center',
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
