import type { ReactNode } from 'react'
import { Section, Text } from '@react-email/components'
import { colors } from '../theme'

interface InfoCardProps {
  title: string
  children: ReactNode
}

/**
 * Rounded card section grouping related fields, with a blue-accented
 * uppercase title in the PantherCreek style.
 */
export default function InfoCard({ title, children }: InfoCardProps) {
  return (
    <Section style={card}>
      <Text style={cardTitle}>{title}</Text>
      {children}
    </Section>
  )
}

const card = {
  backgroundColor: colors.card,
  border: `1px solid ${colors.border}`,
  borderRadius: '10px',
  padding: '20px 22px 8px',
  marginBottom: '16px',
}

const cardTitle = {
  borderLeft: `3px solid ${colors.signal}`,
  color: colors.ink,
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  paddingLeft: '10px',
  margin: '0 0 16px',
}
