import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('Blog form calls the event handler and has the correct details', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const inputs = screen.getAllByRole('textbox')
    const createButton = screen.getByText('create')

    await user.type(inputs[0], 'my test blog')
    await user.type(inputs[1], 'Curtis Vize')
    await user.type(inputs[2], 'https://curtisvize.dev')
    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('my test blog')
    expect(createBlog.mock.calls[0][0].author).toBe('Curtis Vize')
    expect(createBlog.mock.calls[0][0].url).toBe('https://curtisvize.dev')
  })
})