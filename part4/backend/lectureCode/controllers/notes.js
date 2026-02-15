const notesRouter = require('express').Router()
const Note = require('../models/note.js')

notesRouter.get('/', (_request, response) => {
  Note.find({}).then((notes) => response.json(notes))
})

notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => (note ? response.json(note) : response.status(404).end()))
    .catch((error) => next(error))
})

notesRouter.post('/', (request, response, next) => {
  new Note({
    content: request.body.content,
    important: request.body.important || false,
  })
    .save()
    .then((savedNote) => response.json(savedNote))
    .catch((error) => next(error))
})

notesRouter.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then((note) => {
      note ? response.json(note) : response.status(204).end()
    })
    .catch((error) => next(error))
})

notesRouter.put('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (!note) {
        return response.status(404).end()
      }

      const { content, important } = request.body
      note.content = content
      note.important = important

      return note.save().then((updatedNote) => response.json(updatedNote))
    })
    .catch((error) => next(error))
})

module.exports = notesRouter

