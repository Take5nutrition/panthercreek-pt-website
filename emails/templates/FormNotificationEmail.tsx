import ActionButtons, { type ActionButtonsProps } from '../components/ActionButtons'
import EmailLayout from '../components/EmailLayout'
import FieldRow from '../components/FieldRow'
import InfoCard from '../components/InfoCard'

export interface EmailField {
  label: string
  value?: string | null
}

export interface EmailSection {
  title: string
  fields: EmailField[]
}

export interface FormNotificationEmailProps {
  /** Inbox preview line shown next to the subject. */
  preview: string
  /** Small blue tag above the heading. */
  eyebrow: string
  /** Large heading, e.g. "New Appointment Request". */
  heading: string
  /** Pre-formatted Pacific-time submission timestamp. */
  submittedAt?: string
  /** Grouped fields; empty fields and empty sections are dropped. */
  sections: EmailSection[]
  /** Follow-up buttons (reply / call). */
  actions?: ActionButtonsProps
}

/**
 * Generic notification email: any form can be expressed as titled sections
 * of label/value fields plus follow-up actions. The typed templates in this
 * folder are thin wrappers that map their form's props into this shape, so
 * all layout and styling lives in exactly one place.
 */
export default function FormNotificationEmail({
  preview,
  eyebrow,
  heading,
  submittedAt,
  sections,
  actions,
}: FormNotificationEmailProps) {
  // Drop empty fields here (not just in FieldRow) so a section with no
  // populated fields doesn't render an empty card.
  const visibleSections = sections
    .map(section => ({
      ...section,
      fields: section.fields.filter(f => f.value?.trim()),
    }))
    .filter(section => section.fields.length > 0)

  return (
    <EmailLayout
      preview={preview}
      eyebrow={eyebrow}
      heading={heading}
      submittedAt={submittedAt}
    >
      {visibleSections.map(section => (
        <InfoCard key={section.title} title={section.title}>
          {section.fields.map(field => (
            <FieldRow key={field.label} label={field.label} value={field.value} />
          ))}
        </InfoCard>
      ))}
      {actions && <ActionButtons {...actions} />}
    </EmailLayout>
  )
}
