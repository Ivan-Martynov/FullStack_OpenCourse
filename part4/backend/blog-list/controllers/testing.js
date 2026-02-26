const router = require('express').Router()
const Blog = require('../models/blog')
const BlogUser = require('../models/blogUser')

router.post('/reset', async (_request, response) => {
  await Blog.deleteMany({})
  await BlogUser.deleteMany({})

  response.status(204).end()
})

module.exports = router
