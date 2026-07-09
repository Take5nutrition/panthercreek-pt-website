import { createElement as h } from 'react'
import FormNotificationEmail from './FormNotificationEmail.js'

/**
 * Notification for the website contact form (contact.html → /api/contact).
 *
 * @param {{ name: string, email: string, phone?: string, subject?: string, message: string, submittedAt?: string }} props
 */
export default function ContactFormEmail({ name, email, phone, subject, message, submittedAt }) {
  return h(FormNotificationEmail, {
    preview: `${name} sent a message${subject ? ` — ${subject}` : ''}`,
    eyebrow: 'Website Contact',
    heading: 'New Message',
    submittedAt,
    sections: [
      {
        title: 'Contact',
        fields: [
          { label: 'Name', value: name },
          { label: 'Email', value: email },
          { label: 'Phone', value: phone },
        ],
      },
      {
        title: 'Message',
        fields: [
          { label: 'Subject', value: subject },
          { label: 'Message', value: message },
        ],
      },
    ],
    actions: {
      email,
      phone,
      name: name.split(' ')[0],
      replySubject: subject
        ? `Re: ${subject} — PantherCreek PT`
        : 'Re: Your message to PantherCreek PT',
    },
  })
}

/** Sample data for previews (`npm run email:preview`). */
ContactFormEmail.PreviewProps = {
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  phone: '(503) 555-0134',
  subject: 'Question about vestibular rehab',
  message: 'Hi — my doctor recommended vestibular therapy after a recent diagnosis.\nDo you take Providence insurance, and how soon could I get in?',
  submittedAt: 'Wed, Jul 8, 2026, 5:45 PM PT',
}
