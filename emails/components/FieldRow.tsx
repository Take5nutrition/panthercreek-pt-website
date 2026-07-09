import { Text } from '@react-email/components'
import { colors } from '../theme'

export interface FieldRowProps {
  label: string
  value?: string | null
}

/**
 * One labeled value inside an InfoCard. Renders nothing when the value is
 * empty, so templates can pass every field unconditionally.
 */
export default function FieldRow({ label, value }: FieldRowProps) {
  const trimmed = value?.trim()
  if (!trimmed) return null

  return (
    <>
      <Text style={labelStyle}>{label}</Text>
      <Text style={valueStyle}>{trimmed}</Text>
    </>
  )
}

const labelStyle = {
  color: colors.label,
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '1.5px',
  textTransform: 'uppercase' as const,
  margin: '0 0 2px',
}

const valueStyle = {
  color: colors.ink,
  fontSize: '15px',
  lineHeight: '1.5',
  margin: '0 0 14px',
  // Preserve line breaks from textarea answers
  whiteSpace: 'pre-wrap' as const,
}
