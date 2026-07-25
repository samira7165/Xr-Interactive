import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BlogPostForm from '@/app/admin/(protected)/blog/BlogPostForm'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

function mockFetchRouter(handlers) {
  global.fetch = jest.fn((url) => {
    const handler = handlers[url]
    if (!handler) throw new Error(`Unexpected fetch to ${url}`)
    return Promise.resolve(handler())
  })
}

function jsonResponse(status, body) {
  return { ok: status >= 200 && status < 300, status, json: async () => body }
}

describe('BlogPostForm auto-slug', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('derives the slug from the title as you type, for a new post', () => {
    render(<BlogPostForm />)

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Enhancing Acting with AI!' } })

    expect(screen.getByLabelText('Slug')).toHaveValue('enhancing-acting-with-ai')
  })

  it('stops auto-deriving the slug once the user edits it directly', () => {
    render(<BlogPostForm />)

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'First Title' } })
    fireEvent.change(screen.getByLabelText('Slug'), { target: { value: 'custom-slug' } })
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'A Totally Different Title' } })

    expect(screen.getByLabelText('Slug')).toHaveValue('custom-slug')
  })

  it('never auto-derives the slug when editing an existing post', () => {
    render(<BlogPostForm postId={5} initialData={{ title: 'Existing Post', slug: 'existing-post' }} />)

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Renamed Post' } })

    expect(screen.getByLabelText('Slug')).toHaveValue('existing-post')
  })
})

describe('BlogPostForm insert image', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('uploads the selected file and inserts a "![](url)" tag into the body', async () => {
    mockFetchRouter({
      '/api/upload': () => jsonResponse(200, { url: 'https://blob.example.com/pic.png' }),
    })
    render(<BlogPostForm />)

    const file = new File(['bytes'], 'pic.png', { type: 'image/png' })
    fireEvent.change(screen.getByLabelText('Insert Image'), { target: { files: [file] } })

    await waitFor(() => expect(screen.getByLabelText('Body (optional)')).toHaveValue('![](https://blob.example.com/pic.png)\n'))
  })

  it('inserts the image tag after whatever text is already in the body', async () => {
    mockFetchRouter({
      '/api/upload': () => jsonResponse(200, { url: 'https://blob.example.com/pic2.png' }),
    })
    render(<BlogPostForm />)

    fireEvent.change(screen.getByLabelText('Body (optional)'), { target: { value: 'Some intro text.' } })
    const file = new File(['bytes'], 'pic2.png', { type: 'image/png' })
    fireEvent.change(screen.getByLabelText('Insert Image'), { target: { files: [file] } })

    await waitFor(() =>
      expect(screen.getByLabelText('Body (optional)')).toHaveValue(
        'Some intro text.\n![](https://blob.example.com/pic2.png)\n'
      )
    )
  })

  it('shows an error and does not touch the body when the upload fails', async () => {
    mockFetchRouter({
      '/api/upload': () => jsonResponse(400, { error: 'Unsupported file type. Use PNG, JPEG, or WebP.' }),
    })
    render(<BlogPostForm />)

    const file = new File(['bytes'], 'pic.gif', { type: 'image/gif' })
    fireEvent.change(screen.getByLabelText('Insert Image'), { target: { files: [file] } })

    expect(await screen.findByText('Unsupported file type. Use PNG, JPEG, or WebP.')).toBeInTheDocument()
    expect(screen.getByLabelText('Body (optional)')).toHaveValue('')
  })
})

describe('BlogPostForm submit', () => {
  afterEach(() => {
    jest.restoreAllMocks()
    mockPush.mockClear()
  })

  it('POSTs the form fields to /api/admin/blog and redirects to the list on success', async () => {
    mockFetchRouter({
      '/api/admin/blog': () => jsonResponse(200, { success: true }),
    })
    render(<BlogPostForm />)

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'My Post' } })
    fireEvent.change(screen.getByLabelText('Excerpt'), { target: { value: 'A short excerpt.' } })
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'AR/VR' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/admin/blog'))
  })

  it('shows field errors from a 400 response without redirecting', async () => {
    // An invalid slug (e.g. uppercase letters) passes the input's HTML
    // `required` attribute fine but fails PostSchema's server-side regex —
    // unlike an empty required field, which a real browser's own validation
    // would block from ever reaching handleSubmit at all.
    mockFetchRouter({
      '/api/admin/blog': () =>
        jsonResponse(400, { errors: { slug: ['Slug must be lowercase letters, numbers, and hyphens'] } }),
    })
    render(<BlogPostForm />)

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'My Post' } })
    fireEvent.change(screen.getByLabelText('Slug'), { target: { value: 'My Post' } })
    fireEvent.change(screen.getByLabelText('Excerpt'), { target: { value: 'A short excerpt.' } })
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'AR/VR' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Slug must be lowercase letters, numbers, and hyphens')).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('submits to /api/admin/blog/{id} when editing an existing post', async () => {
    mockFetchRouter({
      '/api/admin/blog/5': () => jsonResponse(200, { success: true }),
    })
    render(
      <BlogPostForm
        postId={5}
        initialData={{ title: 'Existing', slug: 'existing', excerpt: 'An excerpt.', category: 'AR/VR' }}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/admin/blog/5', expect.any(Object)))
  })
})
