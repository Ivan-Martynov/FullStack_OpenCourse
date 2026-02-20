const dummy = (_blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return !blogs || blogs.length === 0
    ? 0
    : blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return !blogs || blogs.length === 0
    ? null
    : blogs.reduce((acc, blog) => {
        return !acc || blog.likes > acc.likes ? blog : acc
      }, null)
}

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null
  }

  let maxCount = 0
  let maxAuthor = ''
  blogs.reduce((acc, blog) => {
    const author = blog.author
    acc[author] = (acc[author] || 0) + 1
    if (acc[author] > maxCount) {
      maxCount = acc[author]
      maxAuthor = author
    }
    return acc
  }, {})

  return {
    author: maxAuthor,
    blogs: maxCount,
  }
}

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null
  }

  let maxCount = 0
  let maxAuthor = ''
  blogs.reduce((acc, blog) => {
    const author = blog.author
    acc[author] = (acc[author] || 0) + blog.likes
    if (acc[author] > maxCount) {
      maxCount = acc[author]
      maxAuthor = author
    }
    return acc
  }, {})

  return {
    author: maxAuthor,
    likes: maxCount,
  }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
