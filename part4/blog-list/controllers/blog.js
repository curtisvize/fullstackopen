const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')
//const log = require('../utils/logger')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  const populatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(populatedBlog)
})

blogRouter.post('/:id/comments', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  //log.info('blogRouter comments blog:', blog)
  //log.info('blogRouter comments post request.params.id:', request.params.id)
  //log.info('blogRouter comments post request.body.comment:', request.body.comment)

  if (!blog) {
    response.status(404).end()
  }

  //response.status(201)

  //const comment = request.params.comment
  // if (!blog.comments) {

  // }
  blog.comments.push(request.body.comment)
  const updatedBlog = await blog.save()
  response.json(updatedBlog)
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'access denied' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes, comments } = request.body
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes
  blog.comments = comments

  const updatedBlog = await blog.save()
  response.json(updatedBlog)
})

module.exports = blogRouter