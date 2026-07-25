/**
 * @jest-environment node
 */
// The trickiest part of this action: a *successful* signIn() doesn't return
// normally — Next.js signals the redirect by throwing a special (non-AuthError)
// value, which this action must let propagate after clearing the throttle.
// A *failed* signIn() throws a real AuthError instead.
import { login } from '@/app/admin/login/actions'
import { AuthError } from 'next-auth'
import { signIn } from '@/auth'
import { checkLoginLock, recordFailedLogin, clearLoginAttempts } from '@/lib/login-throttle'
import { buildFormData } from '../helpers/actions'

// next-auth is ESM-only and pulls in @auth/core, which Jest can't parse
// without a transform-pipeline change — mock the package outright instead
// (both this file's and the action's `import { AuthError } from 'next-auth'`
// resolve to this same mock, so `instanceof` checks still work correctly).
jest.mock('next-auth', () => ({
  AuthError: class AuthError extends Error {},
}))
jest.mock('@/auth', () => ({ signIn: jest.fn() }))
jest.mock('@/lib/login-throttle', () => ({
  checkLoginLock: jest.fn(),
  recordFailedLogin: jest.fn(),
  clearLoginAttempts: jest.fn(),
}))

const credentials = { email: 'Admin@Xri.Test', password: 'correct-password' }

describe('login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    checkLoginLock.mockResolvedValue({ locked: false })
  })

  it('rejects an invalid email/password shape before checking the throttle at all', async () => {
    const result = await login(undefined, buildFormData({ email: 'not-an-email', password: '' }))

    expect(result).toEqual({ error: 'Enter a valid email and password.' })
    expect(checkLoginLock).not.toHaveBeenCalled()
    expect(signIn).not.toHaveBeenCalled()
  })

  it('short-circuits with the lock message when the account is currently locked', async () => {
    checkLoginLock.mockResolvedValue({ locked: true, minutesRemaining: 12 })

    const result = await login(undefined, buildFormData(credentials))

    expect(result).toEqual({ error: 'Too many failed attempts. Try again in 12 minutes.' })
    expect(signIn).not.toHaveBeenCalled()
  })

  it('singularizes "minute" when exactly 1 remains', async () => {
    checkLoginLock.mockResolvedValue({ locked: true, minutesRemaining: 1 })

    const result = await login(undefined, buildFormData(credentials))

    expect(result.error).toBe('Too many failed attempts. Try again in 1 minute.')
  })

  it('checks the throttle using the lowercased email', async () => {
    await login(undefined, buildFormData(credentials)).catch(() => {})

    expect(checkLoginLock).toHaveBeenCalledWith('admin@xri.test')
  })

  it('clears the throttle and re-throws Next\'s redirect signal on a successful sign-in', async () => {
    const redirectSignal = Object.assign(new Error('NEXT_REDIRECT'), { digest: 'NEXT_REDIRECT;push;/admin;307;' })
    signIn.mockRejectedValue(redirectSignal)

    await expect(login(undefined, buildFormData(credentials))).rejects.toBe(redirectSignal)

    expect(clearLoginAttempts).toHaveBeenCalledWith('admin@xri.test')
    expect(recordFailedLogin).not.toHaveBeenCalled()
  })

  it('records a failed attempt and returns a generic error for wrong credentials', async () => {
    signIn.mockRejectedValue(new AuthError('CredentialsSignin'))
    recordFailedLogin.mockResolvedValue({ locked: false })

    const result = await login(undefined, buildFormData(credentials))

    expect(result).toEqual({ error: 'Invalid email or password.' })
    expect(recordFailedLogin).toHaveBeenCalledWith('admin@xri.test')
    expect(clearLoginAttempts).not.toHaveBeenCalled()
  })

  it('returns the lock message once a failed attempt crosses the lockout threshold', async () => {
    signIn.mockRejectedValue(new AuthError('CredentialsSignin'))
    recordFailedLogin.mockResolvedValue({ locked: true, minutesRemaining: 15 })

    const result = await login(undefined, buildFormData(credentials))

    expect(result).toEqual({ error: 'Too many failed attempts. Try again in 15 minutes.' })
  })
})
