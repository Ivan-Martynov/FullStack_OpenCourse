const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const BlogUser = require('../models/blogUser')

const api = supertest(app)

describe('Testing with artificial data', async () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    console.log('cleared')

    await Blog.insertMany(helper.initialBlogs)
    console.log('saved')
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('Blog has property named id', () => {
    assert.strictEqual(Blog.prototype.hasOwnProperty('id'), true)
  })

  test('a new blog can be created', async () => {
    const users = await helper.blogUsersInDb()
    const newBlog = {
      title: 'new blog',
      author: 'name surname',
      url: 'important_link_here',
      likes: 37,
      userId: users[0].id,
    }

    const loginRequest = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginRequest.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    assert(titles.includes('new blog'))
  })

  test('a new blog with no likes defaults to zero likes', async () => {
    const users = await helper.blogUsersInDb()
    const newBlog = {
      title: 'new blog',
      author: 'name surname',
      url: 'important_link_here',
      userId: users[0].id,
    }

    const loginRequest = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginRequest.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const lastBlog = blogsAtEnd[blogsAtEnd.length - 1]
    assert.strictEqual(lastBlog.likes, 0)
  })

  test('a new blog with no title or url responds with 400', async () => {
    const newBlog = {
      author: 'name surname',
      url: 'important_link_here',
    }

    const loginRequest = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginRequest.body.token}`)
      .send(newBlog)
      .expect(400)
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const validNonExisting = await helper.nonExistingId()
    await api.get(`/api/blogs/${validNonExisting}`)
  })

  test('a blog can be deleted', async () => {
    const users = await helper.blogUsersInDb()

    const newBlog = {
      title: 'new blog',
      author: 'name surname',
      url: 'important_link_here',
      userId: users[0].id,
    }

    const loginRequest = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
    const authValue = `Bearer ${loginRequest.body.token}`

    const receivedBlog = await api
      .post('/api/blogs')
      .set('Authorization', authValue)
      .send(newBlog)

    const blogsAfterAdd = await helper.blogsInDb()

    const blogToDelete = receivedBlog.body

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', authValue)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const ids = blogsAtEnd.map((blog) => blog.id)
    assert(!ids.includes(blogToDelete.id))
    assert.deepStrictEqual(blogsAtEnd.length, blogsAfterAdd.length - 1)
  })

  test('a blog cannot be deleted by a wrong user', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const loginRequest = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${loginRequest.body.token}`)
      .expect(403)
  })

  test('a blog can be updated', async () => {
    const users = await helper.blogUsersInDb()

    const newBlog = {
      title: 'new blog',
      author: 'name surname',
      url: 'important_link_here',
      userId: users[0].id,
    }

    const loginRequest = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
    const authValue = `Bearer ${loginRequest.body.token}`

    const receivedBlog = await api
      .post('/api/blogs')
      .set('Authorization', authValue)
      .send(newBlog)

    const blogToUpdate = receivedBlog.body

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: blogToUpdate.likes + 1 })
      .set('Authorization', authValue)
      .expect(200)
  })

  test('a blog cannot be updated by a wrong user', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const loginRequest = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: blogToUpdate.likes + 1 })
      .set('Authorization', `Bearer ${loginRequest.body.token}`)
      .expect(403)
  })
})

describe('when there is initially one user in db', async () => {
  beforeEach(async () => {
    await BlogUser.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    await new BlogUser({ username: 'root', passwordHash }).save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.blogUsersInDb()
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

    const usersAtEnd = await helper.blogUsersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((user) => user.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails if username already taken', async () => {
    const usersAtStart = await helper.blogUsersInDb()
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(422)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.blogUsersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creating fails with too short username', async () => {
    const usersAtStart = await helper.blogUsersInDb()
    const newUser = {
      username: 'ro',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert(result.body.error.includes('username too short'))

    const usersAtEnd = await helper.blogUsersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creating fails if username is missing', async () => {
    const usersAtStart = await helper.blogUsersInDb()
    const newUser = {
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert(result.body.error.includes('username required'))

    const usersAtEnd = await helper.blogUsersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creating fails if password is too short', async () => {
    const usersAtStart = await helper.blogUsersInDb()
    const newUser = {
      name: 'root',
      name: 'Superuser',
      password: 'sn',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(422)
      .expect('Content-Type', /application\/json/)
    assert(result.body.error.includes('password is too short'))

    const usersAtEnd = await helper.blogUsersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
