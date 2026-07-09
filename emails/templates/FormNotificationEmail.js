import { createElement as h } from 'react'
import ActionButtons from '../components/ActionButtons.js'
import EmailLayout from '../components/EmailLayout.js'
import FieldRow from '../components/FieldRow.js'
import InfoCard from '../components/InfoCard.js'

/**
 * Generic notification email: any form can be expressed as titled sections
 * of label/value fields plus follow-up actions. The templates in this
 * folder are thin wrappers that map their form's fields into this shape,
 * so all layout and styling lives in exactly one place.
 *
 * @param {object} props
 * @param {string} props.preview
 * @param {string} props.eyebrow
 * @param {string} props.heading
 * @param {string} [props.submittedAt]
 * @param {{ title: string, fields: { label: string, value?: string|null }[] }[]} props.sections
 * @param {{ email?: string, phone?: string, name?: string, replySubject?: string }} [props.actions]
 */
export default function FormNotificationEmail({
  preview,
  eyebrow,
  heading,
  submittedAt,
  sections,
  actions,
}) {
  // Drop empty fields here (not just in FieldRow) so a section with no
  // populated fields doesn't render an empty card.
  const visibleSections = sections
    .map(section => ({
      ...section,
      fields: section.fields.filter(f => f.value?.trim()),
    }))
    .filter(section => section.fields.length > 0)

  return h(EmailLayout, { preview, eyebrow, heading, submittedAt },
    ...visibleSections.map(section =>
      h(InfoCard, { key: section.title, title: section.title },
        ...section.fields.map(field =>
          h(FieldRow, { key: field.label, label: field.label, value: field.value }),
        ),
      ),
    ),
    actions ? h(ActionButtons, actions) : null,
  )
}
