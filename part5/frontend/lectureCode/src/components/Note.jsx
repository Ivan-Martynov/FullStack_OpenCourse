import { useNavigate, useParams } from 'react-router-dom'

const Note = ({ note, toggleImportance, deleteNote }) => {
  const navigate = useNavigate()
  const id = useParams().id

  if (!note) {
    return null
  }

  const label = note.important ? 'make not important' : 'make important'

  const handleDelete = () => {
    if (window.confirm(`Delete note ${note.content}?`)) {
      deleteNote(id)
      navigate('/notes')
    }
  }

  return (
    <li className="note">
      <span>{note.content}</span>
      <button onClick={() => toggleImportance(id)}>{label}</button>
      <button onClick={handleDelete}>delete</button>
    </li>
  )
}

export default Note
