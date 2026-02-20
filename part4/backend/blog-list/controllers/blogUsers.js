const bcrypt = require('bcrypt')
const blogUsersRouter = require('express').Router()
const BlogUser = require('../models/blogUser')

blogUsersRouter.get('/', async (_request, response) => {
  const users = await BlogUser.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  })
  response.json(users)
})

blogUsersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password || password.length < 3) {
    return response.status(422).json({ error: 'password is too short' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const savedUser = await new BlogUser({
    username,
    name,
    passwordHash,
  }).save()

  response.status(201).json(savedUser)
})

module.exports = blogUsersRouter
