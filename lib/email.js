import 'server-only'
import { Resend } from 'resend'

export async function sendLeadNotification(contact) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not set — skipping email notification (contact was still saved).')
    return
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'XRI Website <onboarding@resend.dev>',
      to: process.env.CONTACT_NOTIFICATION_EMAIL,
      replyTo: contact.email,
      subject: `New contact form submission: ${contact.name}`,
      text: [
        `Name: ${contact.name}`,
        `Email: ${contact.email}`,
        `Phone: ${contact.phone || 'Not provided'}`,
        '',
        contact.message,
      ].join('\n'),
    })
  } catch (error) {
    console.error('Failed to send contact notification email:', error)
  }
}
