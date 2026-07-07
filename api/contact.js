import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ── destination inbox ──────────────────────────────────────────────────────────
const TO_EMAIL = 'your@email.com'; // ← swap this for the clinic's real email
// ──────────────────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  try {
    await resend.emails.send({
      from: 'Centerline Website <noreply@yourdomain.com>', // ← swap for a verified Resend sender domain
      to: TO_EMAIL,
      replyTo: email,
      subject: subject
        ? `[Website] ${subject}`
        : `[Website] New message from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:580px;margin:0 auto;color:#0A1A2B">
          <div style="background:#0E2236;padding:24px 32px;border-radius:10px 10px 0 0">
            <p style="margin:0;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.5)">Centerline Physical Therapy</p>
            <h2 style="margin:6px 0 0;color:#fff;font-size:20px">New message from the website</h2>
          </div>
          <div style="background:#fff;padding:28px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#5B6B7A;width:110px">Name</td><td style="padding:8px 0;font-size:15px;color:#0A1A2B">${name}</td></tr>
              <tr><td style="padding:8px 0;font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#5B6B7A">Email</td><td style="padding:8px 0;font-size:15px"><a href="mailto:${email}" style="color:#1A4FA0">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding:8px 0;font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#5B6B7A">Phone</td><td style="padding:8px 0;font-size:15px"><a href="tel:${phone}" style="color:#1A4FA0">${phone}</a></td></tr>` : ''}
              ${subject ? `<tr><td style="padding:8px 0;font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#5B6B7A">Subject</td><td style="padding:8px 0;font-size:15px;color:#0A1A2B">${subject}</td></tr>` : ''}
            </table>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:18px 0">
            <p style="font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#5B6B7A;margin:0 0 10px">Message</p>
            <p style="font-size:15px;line-height:1.7;color:#0A1A2B;margin:0;white-space:pre-wrap">${message}</p>
          </div>
          <p style="text-align:center;font-size:11px;color:#9ca3af;margin-top:16px">Sent from centerlinept.com · Reply directly to respond to ${name}</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
}
