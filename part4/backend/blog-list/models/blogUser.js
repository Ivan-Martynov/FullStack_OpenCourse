const mongoose = require('mongoose')

const blogUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username required'],
    unique: true,
    minLength: [3, 'username too short'],
    match: /[a-zA-Z0-9_]/,
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
})

blogUserSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // The passwordHash should not be revealed.
    delete returnedObject.passwordHash
  },
})

const BlogUser = mongoose.model('BlogUser', blogUserSchema)

module.exports = BlogUser
