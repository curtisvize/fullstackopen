const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }

  const reducer = (max, blog) => {
    return blog.likes > max.likes ? blog : max
  }

  return blogs.reduce(reducer, blogs[0])
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }

  const counts = _.countBy(blogs, 'author')
  const maxAuthor = _.maxBy(Object.keys(counts), key => counts[key])

  return { author: maxAuthor, blogs: counts[maxAuthor] }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }

  const authors = _.groupBy(blogs, 'author')

  const likes = _.mapValues(authors, (blogs) => {
    return _.sumBy(blogs, 'likes')
  })

  const maxLikes = _.maxBy(Object.keys(likes), key => likes[key])

  return { author: maxLikes, likes: likes[maxLikes] }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }