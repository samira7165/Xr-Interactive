// Real end-to-end HTTP lifecycle test: authenticate for real, create a
// project through the real admin route, then confirm it through the real
// public read routes, then update it and confirm again — all against the
// live testdb, no mocks anywhere in the chain.
//
// There is no HTTP DELETE route for portfolio projects in this app (removal
// is a Server Action reachable only from the admin UI, not a fetchable API
// endpoint), so this lifecycle stops at update+verify. resetTestData()
// cleans up the row afterward via direct DB access instead.
import { apiFetch, loginAsAdmin, withCookie } from './helpers/client'
import { resetTestData, disconnectTestDb, taggedSlug } from './helpers/db'

function projectForm(fields) {
  const formData = new FormData()
  for (const [key, value] of Object.entries(fields)) formData.append(key, value)
  return formData
}

// ProjectSchema's `featured` is `z.coerce.boolean()`, i.e. plain `Boolean(x)`
// — the string 'false' coerces to `true` (any non-empty string is truthy).
// The real admin form only produces `false` by omitting the field entirely,
// the same way an unchecked HTML checkbox isn't submitted at all — so
// `featured` is deliberately left out of the base fields below.
const baseFields = {
  title: 'API Test VR Showcase',
  description: 'A project created end-to-end by the real HTTP API test suite.',
  category: 'VR',
  thumbnail: 'https://example.com/thumb.png',
  techStack: 'Unity, C#',
}

describe('Portfolio admin lifecycle (real HTTP)', () => {
  let cookie

  beforeAll(async () => {
    await resetTestData()
    cookie = await loginAsAdmin({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD })
  })

  afterAll(async () => {
    await resetTestData()
    await disconnectTestDb()
  })

  it('rejects an unauthenticated create', async () => {
    const response = await apiFetch('/api/admin/portfolio', {
      method: 'POST',
      body: projectForm({ ...baseFields, slug: taggedSlug('unauth') }),
    })

    expect(response.status).toBe(401)
  })

  it('rejects an authenticated create with an invalid payload', async () => {
    const response = await apiFetch('/api/admin/portfolio', {
      method: 'POST',
      headers: withCookie(cookie),
      body: projectForm({ ...baseFields, title: '', slug: 'INVALID SLUG' }),
    })
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.errors).toHaveProperty('title')
    expect(json.errors).toHaveProperty('slug')
  })

  it('creates, reads, updates, and re-reads a project through the real API', async () => {
    const createSlug = taggedSlug('create')

    // 1. Create
    const createResponse = await apiFetch('/api/admin/portfolio', {
      method: 'POST',
      headers: withCookie(cookie),
      body: projectForm({ ...baseFields, slug: createSlug }),
    })
    expect(createResponse.status).toBe(200)
    expect(await createResponse.json()).toEqual({ success: true })

    // 2. Read back through the public route — proves the write really
    // landed in the database the public site reads from, not just that the
    // admin route returned success.
    const readResponse = await apiFetch(`/api/projects/${createSlug}`)
    const created = await readResponse.json()
    expect(readResponse.status).toBe(200)
    expect(created).toMatchObject({ title: baseFields.title, slug: createSlug, featured: false })

    // It also shows up in the public listing.
    const listResponse = await apiFetch('/api/projects')
    const list = await listResponse.json()
    expect(list.some((p) => p.slug === createSlug)).toBe(true)

    // 3. Update — the update route takes the numeric id from step 2's read,
    // exactly as the admin edit page does.
    const updateSlug = taggedSlug('updated')
    const updateResponse = await apiFetch(`/api/admin/portfolio/${created.id}`, {
      method: 'POST',
      headers: withCookie(cookie),
      body: projectForm({ ...baseFields, title: 'API Test VR Showcase (Updated)', slug: updateSlug, featured: 'true' }),
    })
    expect(updateResponse.status).toBe(200)

    // 4. Re-read — confirms the update is visible through the same public
    // path a real visitor would use.
    const afterUpdate = await apiFetch(`/api/projects/${updateSlug}`)
    const updated = await afterUpdate.json()
    expect(afterUpdate.status).toBe(200)
    expect(updated).toMatchObject({ id: created.id, title: 'API Test VR Showcase (Updated)', featured: true })

    // The old slug is gone now that the slug itself changed.
    const oldSlugResponse = await apiFetch(`/api/projects/${createSlug}`)
    expect(oldSlugResponse.status).toBe(404)
  })

  it('returns 500 (not silently succeeding) when updating an id that does not exist', async () => {
    const response = await apiFetch('/api/admin/portfolio/999999999', {
      method: 'POST',
      headers: withCookie(cookie),
      body: projectForm({ ...baseFields, slug: taggedSlug('missing-id') }),
    })
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.message).toMatch(/record.*not found|does not exist/i)
  })
})
