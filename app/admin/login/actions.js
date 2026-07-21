'use server'

import { AuthError } from 'next-auth'
import { signIn } from '@/auth'
import { LoginSchema } from '@/lib/validation'
import { getLoginDelayMs, recordFailedLogin, clearLoginAttempts } from '@/lib/login-throttle'

export async function login(prevState, formData) {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return { error: 'Enter a valid email and password.' }
  }

  const { email, password } = validatedFields.data
  const throttleKey = email.toLowerCase()

  const delayMs = getLoginDelayMs(throttleKey)
  if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs))

  try {
    await signIn('credentials', { email, password, redirectTo: '/admin' })
  } catch (error) {
    if (error instanceof AuthError) {
      recordFailedLogin(throttleKey)
      return { error: 'Invalid email or password.' }
    }
    // Any other thrown value here is Next's internal redirect signal for a
    // successful sign-in — clear the throttle before letting it propagate.
    clearLoginAttempts(throttleKey)
    throw error
  }
}
