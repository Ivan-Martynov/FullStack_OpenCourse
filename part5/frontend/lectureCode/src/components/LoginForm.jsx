import { useState } from 'react'
import loginService from '../services/login'
import noteService from '../services/notes'

const LoginForm = ({
  setUser,
  setErrorMessage,
  // handleSubmit,
  // handleUsernameChange,
  // handlePasswordChange,
  // username,
  // password,
}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // const [user, setUser] = useState(null)

  const loggedUserKey = 'loggedNoteappUser'
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedUser = await loginService.login({ username, password })

      window.localStorage.setItem(loggedUserKey, JSON.stringify(loggedUser))
      noteService.setToken(loggedUser.token)

      setUser(loggedUser)

      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  // const doLogout = async () => {
  //   handleLogout();
  //   setUsername('')
  //   setPassword('')
  // }

  return (
    <div>
      <h2>Login</h2>
      {/* <form onSubmit={handleSubmit}> */}
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
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
