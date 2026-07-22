import 'server-only'
import { Resend } from 'resend'

async function sendNotification({ subject, text, replyTo }) {
  if (!process.env.RESEND_API_KEY) return

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'XRI Website <onboarding@resend.dev>',
      to: process.env.CONTACT_NOTIFICATION_EMAIL,
      replyTo,
      subject,
      text,
    })
  } catch (error) {
    console.error('Failed to send notification email:', error)
  }
}

export async function sendLeadNotification(contact) {
  await sendNotification({
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
}

export async function sendApplicationNotification(application, jobTitle) {
  await sendNotification({
    replyTo: application.email,
    subject: `New job application: ${application.name} — ${jobTitle}`,
    text: [
      `Job: ${jobTitle}`,
      `Name: ${application.name}`,
      `Email: ${application.email}`,
      `Country: ${application.country}`,
      `LinkedIn: ${application.linkedin || 'Not provided'}`,
      '',
      'View the resume in the admin dashboard under Applications.',
    ].join('\n'),
  })
}
