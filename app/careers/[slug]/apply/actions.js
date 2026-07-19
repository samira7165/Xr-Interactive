'use server'

import { prisma } from '@/lib/prisma'
import { ApplicationSchema } from '@/lib/validation'
import { sendApplicationNotification } from '@/lib/email'

export async function submitApplication(jobId, prevState, formData) {
  const validated = ApplicationSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    country: formData.get('country'),
    linkedin: formData.get('linkedin'),
    resumeUrl: formData.get('resumeUrl'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, success: false }
  }

  const { linkedin, ...rest } = validated.data

  let application
  try {
    application = await prisma.jobApplication.create({
      data: { ...rest, linkedin: linkedin || null, jobId },
      include: { job: { select: { title: true } } },
    })
  } catch (error) {
    return { errors: {}, success: false, message: 'Something went wrong. Please try again.' }
  }

  await sendApplicationNotification(application, application.job?.title || 'a job')

  return { errors: {}, success: true }
}
