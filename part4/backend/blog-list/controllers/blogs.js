const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  response.status(200).json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(400).json({ error: 'UserId missing or invalid.' })
  }

  const body = request.body
  if (!body.likes) {
    request.body.likes = 0
  }

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'Empty title or url' })
  }

  const savedBlog = await new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  }).save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  // A blog can be deleted only by the user who's created it.
  if (!blog.user || !user || blog.user.toString() !== user.id.toString()) {
    return response
      .status(403)
      .json({ error: 'Invalid user to delete the blog' })
  }

  await blog.deleteOne()

  return response.status(204).end()
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  const body = request.body

  if (body.title) {
    blog.title = body.title
  }

  if (body.likes) {
    blog.likes = body.likes
  }

  if (!blog.user || !user || blog.user.toString() !== user.id.toString()) {
    return response
      .status(403)
      .json({ error: 'Invalid user to delete the blog' })
  }

  const updatedBlog = await blog.save()
  response.status(200).json(updatedBlog)
})

module.exports = blogsRouter
