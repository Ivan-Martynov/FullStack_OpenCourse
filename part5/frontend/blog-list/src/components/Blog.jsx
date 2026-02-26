import { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const userCreatedBlog = () => {
    const loggedUserKey = 'loggedBlogAppUser'
    const loggedUserJSON = window.localStorage.getItem(loggedUserKey)
    if (loggedUserJSON) {
      const payload = JSON.parse(atob(loggedUserJSON.split('.')[1]))
      return blog?.user == payload?.id || blog?.user?.id == payload?.id
    }
    return false
  }

  const showRemoveButton = userCreatedBlog()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleDetails = () => setShowDetails(!showDetails)

  const likeBlog = async () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    await updateBlog(updatedBlog)
  }

  const deleteBlog = async () => {
    if (!confirm(`Are you sure you want to delete blog "${blog.title}"?`)) {
      return
    }

    await removeBlog(blog)
  }

  return (
    <div style={blogStyle}>
      <span>
        {blog.title} {blog.author}
      </span>
      <button type="button" onClick={toggleDetails}>
        {showDetails ? 'hide' : 'view'}
      </button>
      {showDetails && (
        <>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes}
            <button type="button" onClick={likeBlog}>
              like
            </button>{' '}
          </p>
          <p>{blog.author}</p>
          {showRemoveButton && (
            <button type="button" onClick={deleteBlog}>
              remove
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default Blog
