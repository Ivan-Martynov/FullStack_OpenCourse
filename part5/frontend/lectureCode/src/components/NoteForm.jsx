import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const NoteForm = ({ createNote: createNote }) => {
  const [newNote, setNewNote] = useState('')
  const navigate = useNavigate()

  const addNote = async (event) => {
    event.preventDefault()

    createNote({
      content: newNote,
      important: true,
    })

    navigate('/notes')
    setNewNote('')
  }

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={(event) => setNewNote(event.target.value)}
          placeholder="write note content here"
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm
