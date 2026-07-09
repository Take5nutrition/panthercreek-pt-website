/**
 * Renders every email template to static HTML using its PreviewProps,
 * so designs can be checked in a browser without sending real emails.
 *
 *   npm run email:preview
 *
 * Output: .email-previews/<TemplateName>.html (gitignored)
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ReactElement } from 'react'
import { render } from '@react-email/components'
import AppointmentRequestEmail from '../emails/templates/AppointmentRequestEmail'
import ContactFormEmail from '../emails/templates/ContactFormEmail'

const previews: [name: string, element: ReactElement][] = [
  ['ContactFormEmail', <ContactFormEmail {...ContactFormEmail.PreviewProps} />],
  ['AppointmentRequestEmail', <AppointmentRequestEmail {...AppointmentRequestEmail.PreviewProps} />],
]

async function main() {
  const outDir = join(__dirname, '..', '.email-previews')
  mkdirSync(outDir, { recursive: true })

  for (const [name, element] of previews) {
    const file = join(outDir, `${name}.html`)
    writeFileSync(file, await render(element))
    console.log(`rendered ${file}`)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
