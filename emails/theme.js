/**
 * PantherCreek Physical Therapy & Balance — email design tokens.
 *
 * Every template pulls colors, type, and spacing from here so the brand
 * can be adjusted in one place. Palette mirrors the site's CSS variables
 * (--navy, --ink, --signal, --paper).
 */
export const colors = {
  navy: '#142849',
  ink: '#1B365D',
  signal: '#0091DA',
  white: '#FFFFFF',
  /** Page background behind the card. */
  page: '#F8FAFC',
  /** Card-section background. */
  card: '#FAFBFC',
  border: '#E5E7EB',
  /** Secondary text (timestamps, footer). */
  muted: '#5B6B7A',
  /** Field labels. */
  label: '#8494A3',
}

/**
 * Web-safe stack — custom fonts are unreliable in email clients (Gmail
 * strips them), so weights and spacing carry the professional look.
 */
export const fontStack =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

export const SITE_URL = 'https://panthercreekpt.com'
/** White wordmark with panther mark — designed for the navy header. */
export const LOGO_URL = `${SITE_URL}/public/Logos/FOOTER%20LOGO.png`
export const BUSINESS_NAME = 'PantherCreek Physical Therapy & Balance'
