'use server'

import { AuthError } from 'next-auth'
import { signIn } from '@/auth'
import { LoginSchema } from '@/lib/validation'
import { checkLoginLock, recordFailedLogin, clearLoginAttempts } from '@/lib/login-throttle'

function lockMessage(minutesRemaining) {
  return `Too many failed attempts. Try again in ${minutesRemaining} minute${minutesRemaining === 1 ? '' : 's'}.`
}

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

  const lock = await checkLoginLock(throttleKey)
  if (lock.locked) {
    return { error: lockMessage(lock.minutesRemaining) }
  }

  try {
    await signIn('credentials', { email, password, redirectTo: '/admin' })
  } catch (error) {
    if (error instanceof AuthError) {
      const result = await recordFailedLogin(throttleKey)
      if (result.locked) {
        return { error: lockMessage(result.minutesRemaining) }
      }
      return { error: 'Invalid email or password.' }
    }
    // Any other thrown value here is Next's internal redirect signal for a
    // successful sign-in — clear the throttle before letting it propagate.
    await clearLoginAttempts(throttleKey)
    throw error
  }
}
