import { useEffect, useState, useRef } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'
import noteService from './services/notes'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes)
    })
  }, [])

  const loggedUserKey = 'loggedNoteappUser'
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(loggedUserKey)
    if (loggedUserJSON) {
      const parsedUser = JSON.parse(loggedUserJSON)
      setUser(parsedUser)
      noteService.setToken(parsedUser.token)
    }
  }, [])

  const toggleImportanceOf = (id) => {
    const note = notes.find((item) => item.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id === id ? returnedNote : note)))
      })
      .catch(() => {
        setErrorMessage(`the note ${id} was already deleted from the server.`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter((item) => item.id !== id))
      })
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm setUser={setUser} setErrorMessage={setErrorMessage} />
    </Togglable>
  )

  const noteFormRef = useRef()

  const addNote = async (noteObject) => {
    noteFormRef.current.toggleVisibility()
    const returnedNote = await noteService.create(noteObject)
    setNotes(notes.concat(returnedNote))
  }
  const noteForm = () => (
    <Togglable buttonLabel="new note" ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

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
          {noteForm()}
        </div>
      )}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>

      <ul>
        {notesToShow.map((note) => {
          return (
            <Note
              key={note.id}
              note={note}
              toggleImportance={() => toggleImportanceOf(note.id)}
            />
          )
        })}
      </ul>

      <Footer />
    </div>
  )
}

export default App
