import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const mockHandler = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={mockHandler} />)

  const titleInput = screen.getByPlaceholderText('add title here')
  const authorInput = screen.getByPlaceholderText('add author here')
  const urlInput = screen.getByPlaceholderText('add url here')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'testing title')
  await user.type(authorInput, 'testing author')
  await user.type(urlInput, 'testing url')
  await user.click(sendButton)

  expect(mockHandler.mock.calls).toHaveLength(1)

  expect(mockHandler.mock.calls[0][0].title).toBe('testing title')
  expect(mockHandler.mock.calls[0][0].author).toBe('testing author')
  expect(mockHandler.mock.calls[0][0].url).toBe('testing url')
})
