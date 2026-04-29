import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import blogService from '../services/blogs'

const LoginForm = ({ setUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const loggedUserKey = 'loggedBlogAppUser'
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedUser = await loginService.login({ username, password })

      window.localStorage.setItem(loggedUserKey, JSON.stringify(loggedUser))
      blogService.setToken(loggedUser.token)

      setUser(loggedUser)

      navigate('/')
      setUsername('')
      setPassword('')
    } catch {
      console.error('wrong username or password')
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              placeholder="enter username"
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              placeholder="enter password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
