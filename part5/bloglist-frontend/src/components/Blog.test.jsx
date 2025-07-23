import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'My super cool test blog',
  author: 'Curtis Vize',
  likes: 1,
  url: 'https://curtisvize.dev',
  user: {
    username: 'curtisvize',
    name: 'Curtis',
    id: '68703185b6c17fee91a88c6e'
  }
}

describe('<Blog />', () => {
  test('renders title and author but not other details', () => {
    const { container } = render(<Blog blog={blog} />)
    const title = container.querySelector('.blogTitle')
    const details = container.querySelector('.blogDetails')

    expect(title).toHaveTextContent('My super cool test blog Curtis Vize')
    expect(details).toBeNull()
  })

  test('URL and likes are rendered when details button is clicked', async () => {
    render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')

    await user.click(button)

    expect(screen.getByText('https://curtisvize.dev'))
    expect(screen.getByText('likes 1'))
  })

  test('when like button is clicked twice, the like event handler is called twice', async () => {
    const mockHandler = vi.fn()
    render(<Blog blog={blog} like={mockHandler} />)

    const user = userEvent.setup()

    await user.click(screen.getByText('view'))

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
