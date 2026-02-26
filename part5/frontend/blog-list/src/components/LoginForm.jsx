import { useState } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'

const LoginForm = ({ setUser, inform }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const loggedUserKey = 'loggedBlogAppUser'
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedUser = await loginService.login({ username, password })

      window.localStorage.setItem(loggedUserKey, JSON.stringify(loggedUser))
      blogService.setToken(loggedUser.token)

      setUser(loggedUser)
      setUsername('')
      setPassword('')

      inform({
        message: `You've logged in as ${loggedUser.name}`,
        messageClass: 'notification-success',
      })
    } catch {
      inform({
        message: 'wrong username or password',
        messageClass: 'notification-failure',
      })
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
