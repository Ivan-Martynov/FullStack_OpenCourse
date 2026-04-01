import { createSlice, current } from "@reduxjs/toolkit";
import noteService from "../services/notes";

const initialState = [
  {
    content: "reducer defines how redux store works",
    important: true,
    id: 1,
  },
  {
    content: "state of store can contain any data",
    important: false,
    id: 2,
  },
];

// const generateId = () => Math.floor(1 + Math.random() * 1000000);

const noteSlice = createSlice({
  name: "notes",
  initialState: [],
  reducers: {
    createNote(state, action) {
      state.push(action.payload);
    },

    toggleImportanceOf(state, action) {
      const id = action.payload;
      const noteToChange = state.find((n) => n.id === id);
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important,
      };
      console.log(current(state));
      return state.map((note) => (note.id !== id ? note : changedNote));
    },

    setNotes(_state, action) {
      return action.payload;
    },
  },
});

const { createNote, setNotes } = noteSlice.actions;

export const initializeNotes = () => {
  return async (dispatch) => {
    const notes = await noteService.getAll();
    dispatch(setNotes(notes));
  };
};

export const appendNote = (content) => {
  return async (dispatch) => {
    const newNote = await noteService.createNew(content);
    dispatch(createNote(newNote));
  };
};

export const { toggleImportanceOf } = noteSlice.actions;
export default noteSlice.reducer;
