import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()

    const blogObject = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    }
    await createBlog(blogObject)
  }

  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="blog-title">title:</label>
          <input
            value={newBlogTitle}
            name="blog-title"
            placeholder="add title here"
            onChange={(event) => setNewBlogTitle(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="blog-author">author:</label>
          <input
            value={newBlogAuthor}
            name="blog-author"
            placeholder="add author here"
            onChange={(event) => setNewBlogAuthor(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="blog-url">url:</label>
          <input
            value={newBlogUrl}
            name="blog-url"
            placeholder="add url here"
            onChange={(event) => setNewBlogUrl(event.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
