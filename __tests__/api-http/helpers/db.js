// Direct DB access for the HTTP test suite: not going through the app at
// all, just Prisma pointed at the same isolated testdb the spawned server
// uses, so tests can reset/inspect rows the server itself wrote.
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '../../../lib/generated/prisma/index.js'
import { getMariaDbConfig } from '../../../lib/db-config.js'

if (!process.env.DATABASE_URL?.includes('/testdb')) {
  throw new Error(
    'DATABASE_URL is not pointed at testdb — refusing to run API HTTP tests against an unexpected database. ' +
      'Run this suite via `npm run test:api` (jest.config.api.js), not the default `npm test`.'
  )
}

const adapter = new PrismaMariaDb(getMariaDbConfig(process.env.DATABASE_URL))
export const testDb = new PrismaClient({ adapter })

// Every row an HTTP test creates is tagged with this prefix (in a slug or
// email field) so cleanup only ever touches test-created rows — never the
// seeded content fixtures (prisma/seed.js's 12 projects, 6 posts, etc.) that
// the read-path tests in this same suite rely on.
export const TEST_TAG = 'apitest'

export function taggedSlug(label) {
  return `${TEST_TAG}-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function taggedEmail(label) {
  return `${TEST_TAG}.${label}.${Date.now()}@example.com`
}

export async function resetTestData() {
  await testDb.comment.deleteMany({ where: { name: { startsWith: TEST_TAG } } })
  await testDb.pageView.deleteMany({ where: { path: { startsWith: `/${TEST_TAG}` } } })
  await testDb.contact.deleteMany({ where: { email: { contains: TEST_TAG } } })
  await testDb.jobApplication.deleteMany({ where: { email: { contains: TEST_TAG } } })
  await testDb.project.deleteMany({ where: { slug: { startsWith: TEST_TAG } } })
  await testDb.post.deleteMany({ where: { slug: { startsWith: TEST_TAG } } })
}

export async function disconnectTestDb() {
  await testDb.$disconnect()
}
