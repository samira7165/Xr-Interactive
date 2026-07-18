'use server'

import { prisma } from '@/lib/prisma'
import { ApplicationSchema } from '@/lib/validation'

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

  try {
    await prisma.jobApplication.create({
      data: { ...rest, linkedin: linkedin || null, jobId },
    })
  } catch (error) {
    return { errors: {}, success: false, message: 'Something went wrong. Please try again.' }
  }

  return { errors: {}, success: true }
}
