// Shared helpers for API route integration tests. Route handlers are plain
// functions over Web Request/Response, so these just remove the boilerplate
// of building that Request and a fake auth() session consistently.

export function adminSession(role = 'ADMIN', overrides = {}) {
  return { user: { id: '1', email: 'admin@xri.com', role, ...overrides } }
}

export function formDataRequest(url, fields, { method = 'POST', headers = {} } = {}) {
  const formData = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && value !== null) formData.append(key, value)
  }
  return new Request(url, { method, headers, body: formData })
}

export function jsonRequest(url, body, { method = 'POST', headers = {} } = {}) {
  return new Request(url, {
    method,
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
}
