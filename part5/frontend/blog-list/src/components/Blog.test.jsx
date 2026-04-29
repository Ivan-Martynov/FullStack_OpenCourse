import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'

const navigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => navigate }
})

const createToken = (payload) => {
  return `xxx.${btoa(JSON.stringify(payload))}.yyy`
}

const isUserCreator = (blog, token) => {
  if (!token) {
    return false
  }
  const payload = JSON.parse(atob(token.split('.')[1]))
  return blog?.user == payload?.id || blog?.user?.id == payload?.id
}

describe('Blog', () => {
  test('does not render like and remove buttons when no user provided', () => {
    const blog = {
      title: 'Adding a test title',
      author: 'Adding a test author',
      url: 'Adding a test url',
      likes: 0,
    }

    const updateBlogHandler = vi.fn()
    const removeBlogHandler = vi.fn()
    render(
      <Blog
        blog={blog}
        updateBlog={updateBlogHandler}
        removeBlog={removeBlogHandler}
        user={null}
      />,
    )

    expect(screen.getByText(`${blog.title}`)).toBeDefined()
    expect(screen.queryByText(`${blog.url}`)).toBeInTheDocument()
    expect(screen.getByText('likes 0')).toBeInTheDocument()
    expect(screen.getByText(`Added by ${blog.author}`)).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'like' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'remove' }),
    ).not.toBeInTheDocument()
  })

  test('renders like button when non-author user provided', () => {
    const token = createToken({ id: '456' })
    const mockUser = { username: 'alice', token }
    window.localStorage.setItem('loggedBlogAppUser', token)

    const blog = {
      title: 'Adding a test title',
      author: 'Adding a test author',
      url: 'Adding a test url',
      likes: 0,
      user: { id: '123' },
    }

    expect(isUserCreator(blog, token)).toBe(false)

    const updateBlogHandler = vi.fn()
    const removeBlogHandler = vi.fn()
    render(
      <Blog
        blog={blog}
        updateBlog={updateBlogHandler}
        removeBlog={removeBlogHandler}
        user={mockUser}
      />,
    )

    expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'remove' }),
    ).not.toBeInTheDocument()
  })

  test('renders like and remove buttons when author user provided', () => {
    const token = createToken({ id: '123' })
    const mockUser = { username: 'alice', token }
    window.localStorage.setItem('loggedBlogAppUser', token)

    const blog = {
      title: 'Adding a test title',
      author: 'Adding a test author',
      url: 'Adding a test url',
      likes: 0,
      user: { id: '123' },
    }

    expect(isUserCreator(blog, token)).toBe(true)

    const updateBlogHandler = vi.fn()
    const removeBlogHandler = vi.fn()
    render(
      <Blog
        blog={blog}
        updateBlog={updateBlogHandler}
        removeBlog={removeBlogHandler}
        user={mockUser}
      />,
    )

    expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'remove' })).toBeInTheDocument()
  })

  test.skip('clicking the view button shows more details', async () => {
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

  test.skip('clicking the like button twice makes the handler call twice', async () => {
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
})
