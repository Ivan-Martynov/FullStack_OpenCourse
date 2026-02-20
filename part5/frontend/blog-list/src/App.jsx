import { useState, useEffect, useCallback } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const [notificationTimer, setNotificationTimer] = useState(null)
  const [notification, setNotification] = useState({
    message: '',
    messageClass: 'notification-failure' | 'notification-success',
  })

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const loggedUserKey = 'loggedBlogAppUser'

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  // let notificationTimer = null
  const inform = useCallback(
    ({ message, messageClass }) => {
      window.clearTimeout(notificationTimer)
      // console.log('calling inform', message, messageClass)

      setNotification({ message, messageClass })
      setNotificationTimer(
        window.setTimeout(() => {
          setNotification({ message: '', messageClass: '' })
        }, 5000),
      )
    },
    [notificationTimer],
  )

  const handleLogout = useCallback(() => {
    inform({
      message: `You've logged out`,
      messageClass: 'notification-success',
    })
    window.localStorage.removeItem(loggedUserKey)
    setUser(null)
  }, [inform])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(loggedUserKey)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      if (blogService.isTokenExpired(user.token)) {
        handleLogout()
      } else {
        setUser(user)
        blogService.setToken(user.token)
      }
    }
  }, [handleLogout])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(loggedUserKey, JSON.stringify(user))
      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')

      inform({
        message: `You've logged in as ${user.name}`,
        messageClass: 'notification-success',
      })
    } catch {
      inform({
        message: 'wrong username or password',
        messageClass: 'notification-failure',
      })
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const addBlog = async (event) => {
    event.preventDefault()

    const blogObject = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    }

    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))

      inform({
        message: `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`,
        messageClass: 'notification-success',
      })
    } catch (error) {
      const message = error.response?.data?.error || error.message
      inform({ message, messageClass: 'notification-failure' })
    }

    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        <label htmlFor="blog-title">title:</label>
        <input
          value={newBlogTitle}
          name="blog-title"
          onChange={(event) => setNewBlogTitle(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="blog-author">author:</label>
        <input
          value={newBlogAuthor}
          name="blog-author"
          onChange={(event) => setNewBlogAuthor(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="blog-url">url:</label>
        <input
          value={newBlogUrl}
          name="blog-url"
          onChange={(event) => setNewBlogUrl(event.target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )

  return (
    <div>
      <div>
        <Notification
          message={notification.message}
          notificationClass={notification.messageClass}
        />
      </div>

      {!user && (
        <div>
          <h2>Login</h2>
          {loginForm()}
        </div>
      )}
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
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default App
