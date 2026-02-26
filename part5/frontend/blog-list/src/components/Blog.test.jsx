import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('renders visible content', () => {
  const blog = {
    title: 'Adding a test title',
    author: 'Adding a test author',
    url: 'Adding a test url',
    likes: 0,
  }

  render(<Blog blog={blog} />)

  const titleAuthorElement = screen.getByText(
    'Adding a test title' + ' Adding a test author',
  )
  // screen.debug(element)

  expect(titleAuthorElement).toBeDefined()

  const urlElement = screen.queryByText('Adding a test url')
  expect(urlElement).toBeNull()

  const likesElement = screen.queryByText('0')
  expect(likesElement).toBeNull()
})

test('clicking the view button shows more details', async () => {
  const blog = {
    title: 'Adding a test title',
    author: 'Adding a test author',
    url: 'Adding a test url',
    likes: 0,
  }

  render(<Blog blog={blog} />)

  const urlElement = screen.queryByText('Adding a test url')
  const likesElement = screen.queryByText('0')
  expect(urlElement).toBeNull()
  expect(likesElement).toBeNull()

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(urlElement).toBeDefined()
  expect(likesElement).toBeDefined()
})

test('clicking the like button twice makes the handler call twice', async () => {
  const blog = {
    title: 'Adding a test title',
    author: 'Adding a test author',
    url: 'Adding a test url',
    likes: 0,
  }

  const mockHandler = vi.fn()
  render(<Blog blog={blog} updateBlog={mockHandler} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
