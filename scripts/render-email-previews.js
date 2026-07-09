/**
 * Renders every email template to static HTML using its PreviewProps,
 * so designs can be checked in a browser without sending real emails.
 *
 *   npm run email:preview
 *
 * Output: .email-previews/<TemplateName>.html (gitignored)
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createElement as h } from 'react'
import { render } from '@react-email/components'
import AppointmentRequestEmail from '../emails/templates/AppointmentRequestEmail.js'
import AutoReplyEmail from '../emails/templates/AutoReplyEmail.js'
import ContactFormEmail from '../emails/templates/ContactFormEmail.js'

const templates = [ContactFormEmail, AppointmentRequestEmail, AutoReplyEmail]

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', '.email-previews')
mkdirSync(outDir, { recursive: true })

for (const Template of templates) {
  const file = join(outDir, `${Template.name}.html`)
  writeFileSync(file, await render(h(Template, Template.PreviewProps)))
  console.log(`rendered ${file}`)
}
