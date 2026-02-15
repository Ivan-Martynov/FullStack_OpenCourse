const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const oneBlogList = [
  {
    title: 'Blog No 1',
    author: 'John Doe',
    url: 'linkhere',
    likes: 3,
  },
]

const blogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  },
]

describe('Total likes', () => {
  test('Empty list returns zero', () => {
    const result = listHelper.totalLikes(null)
    assert.strictEqual(result, 0)
  })

  test('List with only one blog returns the likes of that blog', () => {
    const result = listHelper.totalLikes(oneBlogList)
    assert.strictEqual(result, 3)
  })

  test('List of blogs returns sum of their likes', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })
})

describe('Favorite blog', () => {
  test('Empty list returns null', () => {
    const result = listHelper.favoriteBlog([])
    assert.deepStrictEqual(result, null)
  })

  test('List with only one blog returns that blog', () => {
    const result = listHelper.favoriteBlog(oneBlogList)
    assert.deepStrictEqual(result, oneBlogList[0])
  })

  test('List of blogs returns one of the blogs with highest likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[2])
  })
})

describe('Most blogs', () => {
  test('Empty list return null', () => {
    assert.deepStrictEqual(listHelper.mostBlogs([]), null)
  })

  test("List with only one blog returns that blog author and blog's likes", () => {
    const result = listHelper.mostBlogs(oneBlogList)
    assert.deepStrictEqual(result, { author: oneBlogList[0].author, blogs: 1 })
  })

  test('List of blogs returns the author with most blogs and the number of their blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })
})

describe('Most likes', () => {
  test('Empty list return null', () => {
    assert.deepStrictEqual(listHelper.mostLikes([]), null)
  })

  test("List with only one blog returns that blog author and blog's likes", () => {
    const result = listHelper.mostLikes(oneBlogList)
    assert.deepStrictEqual(result, {
      author: oneBlogList[0].author,
      likes: oneBlogList[0].likes,
    })
  })

  test('List of blogs returns the author with most total likes and the number of likes', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })
})

