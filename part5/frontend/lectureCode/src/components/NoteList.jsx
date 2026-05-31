import { useState, useEffect } from 'react'
import Notification from './Notification'
import Togglable from './Togglable'
import LoginForm from './LoginForm'
import noteService from '../services/notes'
import { Link } from 'react-router-dom'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'

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
  console.log(notesToShow)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>content</TableCell>
              <TableCell>user</TableCell>
              <TableCell>important</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notesToShow.map((note) => (
              <TableRow key={note.id}>
                <TableCell>
                  <Link to={`/notes/${note.id}`}>{note.content}</Link>
                </TableCell>
                <TableCell>{note.user ? note.user.name : ''}</TableCell>
                <TableCell>{note.important ? 'yes' : ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
      </TableContainer>
    </div>
  )
}
export default NoteList
