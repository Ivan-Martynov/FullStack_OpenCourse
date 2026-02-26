import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [notificationTimer, setNotificationTimer] = useState(null)
  const [notification, setNotification] = useState({
    message: '',
    messageClass: 'notification-failure' | 'notification-success',
  })

  const [user, setUser] = useState(null)

  const loggedUserKey = 'loggedBlogAppUser'

  useEffect(() => {
    const fetchData = async () => {
      const blogsData = await blogService.getAll()
      setBlogs(blogsData)
    }
    fetchData()
  }, [])

  const inform = ({ message, messageClass }) => {
    window.clearTimeout(notificationTimer)

    setNotification({ message, messageClass })
    setNotificationTimer(
      window.setTimeout(() => {
        setNotification({ message: '', messageClass: '' })
      }, 5000),
    )
  }

  const handleLogout = () => {
    inform({
      message: 'You"ve logged out',
      messageClass: 'notification-success',
    })
    window.localStorage.removeItem(loggedUserKey)
    setUser(null)
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(loggedUserKey)
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      if (blogService.isTokenExpired(loggedUser.token)) {
        handleLogout()
      } else {
        setUser(loggedUser)
        blogService.setToken(loggedUser.token)
      }
    }
  }, [])

  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm setUser={setUser} inform={inform} />
    </Togglable>
  )

  const blogFormRef = useRef()

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      // console.log(`returnedBlog: ${returnedBlog?.user} `)
      setBlogs(blogs.concat(returnedBlog))

      inform({
        message: `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`,
        messageClass: 'notification-success',
      })
    } catch (error) {
      const message = error.response?.data?.error || error.message
      inform({ message, messageClass: 'notification-failure' })
    }
  }

  const updateBlog = async (updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(updatedBlog.id, updatedBlog)
      // if (userCreatedBlog(updatedBlog)) {
      //   returnedBlog.removeBlog = updatedBlog.removeBlog
      // }
      setBlogs(
        blogs.map((item) =>
          item.id === returnedBlog.id ? returnedBlog : item,
        ),
      )
      inform({
        message: `Blog "${returnedBlog.title}" updated`,
        messageClass: 'notification-success',
      })
    } catch (error) {
      const message = error.response?.data?.error || error.message
      inform({ message, messageClass: 'notification-failure' })
      setBlogs(blogs.filter((item) => item.id !== updatedBlog.id))
    }
  }

  const removeBlog = async (blog) => {
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((item) => item.id !== blog.id))
      inform({
        message: `Blog "${blog.title}" removed`,
        messageClass: 'notification-success',
      })
    } catch (error) {
      const message = error.response?.data?.error || error.message
      inform({ message, messageClass: 'notification-failure' })
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const userCreatedBlog = (blog) => {
    const loggedUserJSON = window.localStorage.getItem(loggedUserKey)
    if (loggedUserJSON) {
      const payload = JSON.parse(atob(loggedUserJSON.split('.')[1]))
      // console.log(`payload: ${JSON.stringify(payload)}`)
      // console.log(`blog: ${JSON.stringify(blog)}`)
      return blog?.user?.id == payload?.id
    }
    return false
  }

  return (
    <div>
      <div>
        <Notification
          message={notification.message}
          notificationClass={notification.messageClass}
        />
      </div>

      {!user && loginForm()}
      {user && (
        <div>
          <p>
            Logged in as <strong>{user.name}</strong>
            <button type="button" onClick={handleLogout}>
              logout
            </button>
          </p>
          {blogForm()}
        </div>
      )}

      <h2>blogs</h2>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            removeBlog={removeBlog}
          />
        ))}
    </div>
  )
}

export default App
