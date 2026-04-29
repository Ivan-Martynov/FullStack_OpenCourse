import { useState, useEffect } from 'react'
import Notification from './Notification'
import Togglable from './Togglable'
import LoginForm from './LoginForm'
import noteService from '../services/notes'
import { Link } from 'react-router-dom'

const NoteList = ({ notes }) => {
  const [showAll, setShowAll] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  const loggedUserKey = 'loggedNoteappUser'
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(loggedUserKey)
    if (loggedUserJSON) {
      const parsedUser = JSON.parse(loggedUserJSON)
      setUser(parsedUser)
      noteService.setToken(parsedUser.token)
    }
  }, [])

  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm setUser={setUser} setErrorMessage={setErrorMessage} />
    </Togglable>
  )

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && (
        <div>
          <span>{user.name} logged in</span>
          <button
            type="button"
            onClick={() => {
              window.localStorage.removeItem(loggedUserKey)
              setUser(null)
            }}
          >
            logout
          </button>
        </div>
      )}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>

      <ul>
        {notesToShow.map((note) => (
          <li key={note.id}>
            <Link to={`/notes/${note.id}`}>{note.content}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default NoteList
