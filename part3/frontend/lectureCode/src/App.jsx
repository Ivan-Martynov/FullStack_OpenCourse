import { useEffect, useState } from "react";
import Note from "./components/Note";
import noteService from "./services/notes";
import Notification from "./components/Notification";
import Footer from "./components/Footer";

const App = () => {
    const [notes, _setNotes] = useState([]);
    const [newNote, _setNewNote] = useState("A new note...");
    const [showAll, _setShowAll] = useState(false);
    const [errorMessage, _setErrorMessage] = useState(null);

    useEffect(() => {
        noteService.getAll().then((initialNotes) => {
            _setNotes(initialNotes);
        });
    }, []);
    console.log("Render ", notes.length, " notes...");

    const addNote = (event) => {
        event.preventDefault();
        const noteObject = {
            content: newNote,
            important: Math.random() < 0.5,
        };
        noteService.create(noteObject).then((returnedNote) => {
            console.log(returnedNote);

            _setNotes(notes.concat(returnedNote));
            _setNewNote("");
        });
    };

    const handleNoteChange = (event) => {
        _setNewNote(event.target.value);
    };

    const toggleImportanceOf = (id) => {
        console.log("Importance of ", id, " must be toggled");
        // const url = `${id}`;
        // const url = `http://localhost:3001/notes/${id}`;
        const note = notes.find((item) => item.id === id);
        const changedNote = { ...note, important: !note.important };

        noteService
            .update(id, changedNote)
            .then((returnedNote) => {
                _setNotes(
                    notes.map((note) =>
                        note.id === id ? returnedNote.data : note
                    )
                );
            })
            .catch(() => {
                _setErrorMessage(
                    `the note ${id} was already deleted from the server.`
                );
                setTimeout(() => {
                    _setErrorMessage(null);
                }, 5000);
                _setNotes(notes.filter((item) => item.id !== id));
            });
    };

    const notesToShow = showAll
        ? notes
        : notes.filter((note) => note.important);

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage} />
            <div>
                <button onClick={() => _setShowAll(!showAll)}>
                    show {showAll ? "important" : "all"}
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
                    );
                })}
            </ul>
            <form onSubmit={addNote}>
                <input value={newNote} onChange={handleNoteChange} />
                <button type="submit">save</button>
            </form>
            <Footer />
        </div>
    );
};

export default App;
