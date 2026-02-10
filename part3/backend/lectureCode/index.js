require('dotenv').config()

const express = require('express')
const cors = require('cors')
const Note = require('./models/note')

const app = express()

const requestLogger = (request, _response, next) => {
  console.log('Method: ', request.method)
  console.log('Path: ', request.path)
  console.log('Body: ', request.body)
  console.log('---')
  next()
}

// Activate CORS (Cross-Origin Resource Sharing).
app.use(cors())

app.use(express.static('dist'))

// Activate the json parser.
app.use(express.json())
app.use(requestLogger)

app.get('/', (_request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (_request, response) => {
  Note.find({}).then((notes) => response.json(notes))
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => (note ? response.json(note) : response.status(404).end()))
    .catch((error) => next(error))
})

// Adding a note.
app.post('/api/notes', (request, response, next) => {
  new Note({
    content: request.body.content,
    important: request.body.important || false,
  })
    .save()
    .then((savedNote) => response.json(savedNote))
    .catch((error) => next(error))
})

app.put('/api/notes/:id', (request, response) => {
  Note.findByIdAndUpdate(request.params.id, request.body, { new: true })
    .then((note) => {
      note
        ? note.save().then((updatedNote) => response.json(updatedNote))
        : response.status(404).json({ error: 'Note not found' })
    })
    .catch((error) =>
      console.error(`Error accessing ${request.params.id}: ${error}`),
    )
})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then((note) => {
      note ? response.json(note) : response.status(204).end()
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
}
app.use(unknownEndpoint)

// The error-handling middleware has to be the last loaded middleware, also all
// the routes should be registered before the error-handler.
const errorHandler = (error, _request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'Malformed id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
