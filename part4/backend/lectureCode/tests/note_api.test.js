const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Note = require('../models/note')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially some notes saved', async () => {
  beforeEach(async () => {
    await Note.deleteMany({})
    await Note.insertMany(helper.initialNotes)
  })

  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')
    assert.strictEqual(response.body.length, helper.initialNotes.length)
  })

  test('a valid note can be added', async () => {
    const users = await helper.usersinDb()
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
      userId: users[0].id,
    }

    const loginRequest = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    await api
      .post('/api/notes')
      .set('Authorization', `Bearer ${loginRequest.body.token}`)
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDb()
    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)

    const contents = notesAtEnd.map((note) => note.content)
    assert(contents.includes('async/await simplifies making async calls'))
  })

  test('note without content is not added', async () => {
    const newNote = { important: true }

    const loginRequest = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    await api
      .post('/api/notes')
      .set('Authorization', `Bearer ${loginRequest.body.token}`)
      .send(newNote)
      .expect(400)

    const notesAtEnd = await helper.notesInDb()
    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')
    const contents = response.body.map((e) => e.content)
    assert(contents.includes('HTML is easy'))
  })

  test('viewing a specific note', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.deepStrictEqual(resultNote.body, noteToView)
  })

  test('fails with status code 404 if note does not exist', async () => {
    const validNonExisting = await helper.nonExistingId()
    await api.get(`/api/notes/${validNonExisting}`)
  })

  test('a note can be deleted', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)

    const notesAtEnd = await helper.notesInDb()

    const ids = notesAtEnd.map((note) => note.id)
    assert(!ids.includes(noteToDelete.id))
    assert.deepStrictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
  })
})

describe('when there is initially one user in db', async () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    await new User({ username: 'root', passwordHash }).save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersinDb()
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersinDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((user) => user.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails if username already taken', async () => {
    const usersAtStart = await helper.usersinDb()
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersinDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})

