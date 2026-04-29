import { useEffect, useState } from 'react'
import { Link, Route, Routes, useMatch } from 'react-router-dom'

import noteService from './services/notes'
import Footer from './components/Footer'
import NoteForm from './components/NoteForm'
import Home from './components/Home'
import NoteList from './components/NoteList'
import Note from './components/Note'
import Notification from './components/Notification'

const App = () => {
  const [notes, setNotes] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes)
      console.log(initialNotes)
    })
  }, [])

  const match = useMatch('/notes/:id')
  const note = match ? notes.find((note) => note.id === match.params.id) : null

  const addNote = async (noteObject) => {
    const returnedNote = await noteService.create(noteObject)
    setNotes(notes.concat(returnedNote))
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find((item) => item.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        console.error(returnedNote)
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

  const deleteNote = async (id) => {
    await noteService.remove(id)
    setNotes(notes.filter((n) => n.id !== id))
  }

  const padding = { padding: 5 }

  return (
    <div>
      <div>
        <Link style={padding} to="/">
          home
        </Link>
        <Link style={padding} to="/notes">
          notes
        </Link>
        <Link style={padding} to="/create">
          new note
        </Link>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<NoteList notes={notes} />} />
        <Route
          path="/notes/:id"
          element={
            <Note
              note={note}
              toggleImportance={toggleImportanceOf}
              deleteNote={deleteNote}
            />
          }
        />
        <Route path="/create" element={<NoteForm createNote={addNote} />} />
      </Routes>
      <Notification message={errorMessage} />
      <Footer />
    </div>
  )
}

export default App
