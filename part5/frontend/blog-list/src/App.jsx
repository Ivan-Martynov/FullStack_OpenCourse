import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import {
  Link,
  Navigate,
  Route,
  Routes,
  useMatch,
  useNavigate,
} from 'react-router-dom'
import BlogList from './components/BlogList'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((b) => b.id === match.params.id) : null

  const loggedUserKey = 'loggedBlogAppUser'

  useEffect(() => {
    const fetchData = async () => {
      const blogsData = await blogService.getAll()
      setBlogs(blogsData)
    }
    fetchData()
  }, [])

  const handleLogout = async () => {
    window.localStorage.removeItem(loggedUserKey)
    setUser(null)
    navigate('/')
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

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))

      navigate('/')
    } catch (error) {
      console.error(error.response?.data?.error || error.message)
    }
  }

  const updateBlog = async (updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(updatedBlog.id, updatedBlog)
      setBlogs(
        blogs.map((item) =>
          item.id === returnedBlog.id ? returnedBlog : item,
        ),
      )
    } catch (error) {
      console.error(error.response?.data?.error || error.message)
      setBlogs(blogs.filter((item) => item.id !== updatedBlog.id))
    }
  }

  const removeBlog = async (blog) => {
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((item) => item.id !== blog.id))
    } catch (error) {
      const message = error.response?.data?.error || error.message
      error(message)
    }
  }

  const padding = { padding: 5 }

  return (
    <div>
      <Link style={padding} to="/">
        blogs
      </Link>
      {user && (
        <Link style={padding} to="/create">
          new blog
        </Link>
      )}
      {user ? (
        <button type="button" onClick={handleLogout}>
          logout
        </button>
      ) : (
        <Link style={padding} to="/login">
          login
        </Link>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/blogs" replace />} />
        <Route path="/blogs" element={<BlogList blogs={blogs} />} />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={blog}
              updateBlog={updateBlog}
              removeBlog={removeBlog}
              user={user}
            />
          }
        />
        <Route path="/create" element={<BlogForm createBlog={addBlog} />} />
        <Route path="/login" element={<LoginForm setUser={setUser} />} />
      </Routes>
    </div>
  )
}

export default App
