import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ContactForm from '@/components/ContactForm'

function fillForm({ name, email, phone = '', message }) {
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: name } })
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } })
  if (phone) fireEvent.change(screen.getByLabelText('Phone (optional)'), { target: { value: phone } })
  fireEvent.change(screen.getByLabelText('Tell us about your project'), { target: { value: message } })
}

function mockFetchOnce(status, body) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  })
}

describe('ContactForm', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('POSTs name, email, phone, and message to /api/contacts', async () => {
    mockFetchOnce(200, {})
    render(<ContactForm />)

    fillForm({ name: 'Jane', email: 'jane@example.com', phone: '+8801111111', message: 'Need a VR demo built.' })
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/contacts',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Jane',
          email: 'jane@example.com',
          phone: '+8801111111',
          message: 'Need a VR demo built.',
        }),
      })
    )
  })

  it('shows the "Message Sent!" confirmation on success', async () => {
    mockFetchOnce(200, {})
    render(<ContactForm />)

    fillForm({ name: 'Jane', email: 'jane@example.com', message: 'Need a VR demo built.' })
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText('Message Sent!')).toBeInTheDocument()
  })

  it('shows field errors returned from a 400 response', async () => {
    mockFetchOnce(400, { errors: { message: ['Tell us a bit more about your project'] } })
    render(<ContactForm />)

    fillForm({ name: 'Jane', email: 'jane@example.com', message: 'Hi' })
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText('Tell us a bit more about your project')).toBeInTheDocument()
  })

  it('shows a generic error when the request throws', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    render(<ContactForm />)

    fillForm({ name: 'Jane', email: 'jane@example.com', message: 'Need a VR demo built.' })
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText('Something went wrong. Please try again.')).toBeInTheDocument()
  })
})
