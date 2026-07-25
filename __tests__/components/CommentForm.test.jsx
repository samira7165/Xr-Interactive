import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CommentForm from '@/app/blog/[slug]/CommentForm'

function fillForm({ name, body }) {
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: name } })
  fireEvent.change(screen.getByLabelText('Comment'), { target: { value: body } })
}

function mockFetchOnce(status, body) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  })
}

describe('CommentForm', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('POSTs name and comment to the slug-scoped comments endpoint', async () => {
    mockFetchOnce(201, { status: 'pending' })
    render(<CommentForm slug="my-post" />)

    fillForm({ name: 'Jane', body: 'Nice post!' })
    fireEvent.click(screen.getByRole('button', { name: /post comment/i }))

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/blog/my-post/comments',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Jane', body: 'Nice post!' }),
      })
    )
  })

  // Regression test for the bug where `e.currentTarget.reset()` was called
  // after the `await fetch(...)` — React nullifies the synthetic event's
  // currentTarget by then, so `.reset()` threw and the catch block showed
  // "Something went wrong" even though the comment had already saved.
  it('shows the pending-review message after a successful submit, not an error', async () => {
    mockFetchOnce(201, { status: 'pending' })
    render(<CommentForm slug="my-post" />)

    fillForm({ name: 'Jane', body: 'Nice post!' })
    fireEvent.click(screen.getByRole('button', { name: /post comment/i }))

    expect(await screen.findByText(/will appear once it.?s reviewed/i)).toBeInTheDocument()
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument()
  })

  it('shows field errors returned from a 400 response', async () => {
    mockFetchOnce(400, { errors: { body: ['Comment is required'] } })
    render(<CommentForm slug="my-post" />)

    fillForm({ name: 'Jane', body: 'x' })
    fireEvent.click(screen.getByRole('button', { name: /post comment/i }))

    expect(await screen.findByText('Comment is required')).toBeInTheDocument()
  })

  it('shows the server-provided message on a 429 response', async () => {
    mockFetchOnce(429, { error: 'Too many requests. Please try again later.' })
    render(<CommentForm slug="my-post" />)

    fillForm({ name: 'Jane', body: 'Nice post!' })
    fireEvent.click(screen.getByRole('button', { name: /post comment/i }))

    expect(await screen.findByText('Too many requests. Please try again later.')).toBeInTheDocument()
  })

  it('shows a generic error and stays on the form when the request throws', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    render(<CommentForm slug="my-post" />)

    fillForm({ name: 'Jane', body: 'Nice post!' })
    fireEvent.click(screen.getByRole('button', { name: /post comment/i }))

    expect(await screen.findByText('Something went wrong. Please try again.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /post comment/i })).toBeInTheDocument()
  })
})
