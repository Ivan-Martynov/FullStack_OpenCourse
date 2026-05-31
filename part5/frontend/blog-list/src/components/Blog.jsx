import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  useParams().id
  const navigate = useNavigate()

  if (!blog) {
    return null
  }

  const userCreatedBlog = () => {
    const loggedUserKey = 'loggedBlogAppUser'
    const loggedUserJSON = window.localStorage.getItem(loggedUserKey)
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      const payload = JSON.parse(atob(loggedUser.token.split('.')[1]))
      return blog?.user == payload?.id || blog?.user?.id == payload?.id
    }
    return false
  }

  // const blogStyle = {
  //   paddingTop: 10,
  //   paddingLeft: 2,
  //   border: 'solid',
  //   borderWidth: 1,
  //   marginBottom: 5,
  // }

  const likeBlog = async () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    await updateBlog(updatedBlog)
  }

  const deleteBlog = async () => {
    if (!confirm(`Are you sure you want to delete blog "${blog.title}"?`)) {
      return
    }

    await removeBlog(blog)
    navigate('/')
  }

  return (
    <article>
      <h2>{blog.title}</h2>
      <p>
        <a href="{blog.url}">{blog.url}</a>
      </p>
      <p>
        <span>likes {blog.likes}</span>
        {user && (
          <button type="button" onClick={likeBlog}>
            like
          </button>
        )}
      </p>
      <p>Added by {blog.author}</p>
      {userCreatedBlog() && (
        <button type="button" onClick={deleteBlog}>
          remove
        </button>
      )}
    </article>
  )
}

export default Blog
