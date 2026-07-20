'use server'

import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { ApplicationSchema } from '@/lib/validation'
import { sendApplicationNotification } from '@/lib/email'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function submitApplication(jobId, prevState, formData) {
  const ip = getClientIp(await headers())
  const { allowed, retryAfter } = rateLimit(`apply:${ip}`, { limit: 5, windowMs: 60_000 })
  if (!allowed) {
    return { errors: {}, success: false, message: `Too many requests. Please try again in ${retryAfter}s.` }
  }

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
