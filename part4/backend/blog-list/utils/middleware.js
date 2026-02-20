const jwt = require('jsonwebtoken')
const logger = require('./logger')
const BlogUser = require('../models/blogUser')

const getToken = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  } else {
    return null
  }
}

const tokenExtractor = async (request, _response, next) => {
  const token = getToken(request)
  if (token) {
    request.token = token
  }
  next()
}

const userExtractor = async (request, _response, next) => {
  const token = getToken(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  const user = await BlogUser.findById(decodedToken.id)
  if (user) {
    request.user = user
  }
  next()
}

const requestLogger = (request, _response, next) => {
  logger.info('Method: ', request.method)
  logger.info('Path: ', request.path)
  logger.info('Body: ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
}

// The error-handling middleware has to be the last loaded middleware, also all
// the routes should be registered before the error-handler.
const errorHandler = (error, _request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'Malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    response.status(422).json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'Invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'Token expired' })
  }

  next(error)
}

module.exports = {
  tokenExtractor,
  userExtractor,
  requestLogger,
  unknownEndpoint,
  errorHandler,
}
