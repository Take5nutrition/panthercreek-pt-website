import { createElement as h, Fragment } from 'react'
import { Text } from '@react-email/components'
import { colors } from '../theme.js'

/**
 * One labeled value inside an InfoCard. Renders nothing when the value is
 * empty, so templates can pass every field unconditionally.
 *
 * @param {{ label: string, value?: string | null }} props
 */
export default function FieldRow({ label, value }) {
  const trimmed = value?.trim()
  if (!trimmed) return null

  return h(Fragment, null,
    h(Text, { style: labelStyle }, label),
    h(Text, { style: valueStyle }, trimmed),
  )
}

const labelStyle = {
  color: colors.label,
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  margin: '0 0 2px',
}

const valueStyle = {
  color: colors.ink,
  fontSize: '15px',
  lineHeight: '1.5',
  margin: '0 0 14px',
  // Preserve line breaks from textarea answers
  whiteSpace: 'pre-wrap',
}
