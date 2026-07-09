import { createElement as h } from 'react'
import FormNotificationEmail from './FormNotificationEmail.js'

/**
 * Notification for the appointment-request modal
 * (fitness-wellness.html → /api/appointment).
 *
 * @param {object} props
 * @param {string} props.firstName
 * @param {string} props.lastName
 * @param {string} props.email
 * @param {string} props.phone
 * @param {string} [props.location]
 * @param {string} [props.preferredDate]
 * @param {string} [props.preferredTime]
 * @param {string} [props.program]
 * @param {string} [props.trainingFormat]
 * @param {string} [props.athleteName]  Youth Performance only.
 * @param {string} [props.athleteAge]   Youth Performance only.
 * @param {string} [props.submittedAt]
 */
export default function AppointmentRequestEmail({
  firstName,
  lastName,
  email,
  phone,
  location,
  preferredDate,
  preferredTime,
  program,
  trainingFormat,
  athleteName,
  athleteAge,
  submittedAt,
}) {
  const isYouth = Boolean(athleteName?.trim() || athleteAge?.trim())

  return h(FormNotificationEmail, {
    preview: `${firstName} ${lastName} requested an appointment${location ? ` — ${location}` : ''}`,
    eyebrow: 'Appointment Request',
    heading: 'New Appointment Request',
    submittedAt,
    sections: [
      {
        title: 'Appointment',
        fields: [
          { label: 'Location', value: location },
          { label: 'Preferred Date', value: preferredDate },
          { label: 'Preferred Time', value: preferredTime },
        ],
      },
      {
        title: 'Program',
        fields: [
          { label: 'Interested In', value: program },
          { label: 'Training Format', value: trainingFormat },
        ],
      },
      {
        title: 'Athlete',
        fields: [
          { label: 'Name', value: athleteName },
          { label: 'Age', value: athleteAge },
        ],
      },
      {
        title: isYouth ? 'Guardian Contact' : 'Contact',
        fields: [
          { label: isYouth ? 'Guardian' : 'Name', value: `${firstName} ${lastName}` },
          { label: 'Email', value: email },
          { label: 'Phone', value: phone },
        ],
      },
    ],
    actions: {
      email,
      phone,
      name: firstName,
      replySubject: 'Your Appointment Request — PantherCreek PT',
    },
  })
}

/** Sample data for previews (`npm run email:preview`). */
AppointmentRequestEmail.PreviewProps = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@example.com',
  phone: '(503) 555-0134',
  location: 'Clackamas',
  preferredDate: 'Wed, Jul 15, 2026',
  preferredTime: 'Morning',
  program: 'Youth Performance',
  trainingFormat: 'Small Group',
  athleteName: 'Riley Smith',
  athleteAge: '14',
  submittedAt: 'Wed, Jul 8, 2026, 5:45 PM PT',
}
