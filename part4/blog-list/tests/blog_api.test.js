const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('blog api tests', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  describe('GET requests and data integrity', () => {
    test('http GET returns correct number of blogs', async () => {
      const response = await api.get('/api/blogs')
    
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })
    
    test('verify blog identifier is \'id\', not \'_id\'', async () => {
      const response = await api.get('/api/blogs')
      
      assert.ok(response.body[0].id)
      assert.strictEqual(response.body[0]._id, undefined)
    })
  })

  describe('adding a new blog', () => {
    test('http POST succesfully creates a new blog post', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const token = helper.getToken()

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(helper.oneBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)
    
      const titles = blogsAtEnd.map(b => b.title)
      assert(titles.includes('My very cool blog'))
    })

    test('adding a blog without a token returns 401 Unauthorized', async () => {
      const blogsAtStart = await helper.blogsInDb()

      await api
        .post('/api/blogs')
        .send(helper.oneBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })
  })

  describe('POST validation / missing properties', () => {
    test('if likes property is missing, it\'s set to zero', async () => {
      const token = helper.getToken()

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(helper.missingLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      const blogsAtEnd = await helper.blogsInDb()
      const likes = blogsAtEnd[blogsAtEnd.length - 1].likes
    
      assert.strictEqual(likes, 0)
    })
  
    test('if title is missing, api responds with 400 Bad Request', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const token = helper.getToken()

      const missingTitle = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(helper.missingTitle)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      
      const blogsAtEnd = await helper.blogsInDb()

      assert(missingTitle.body.error.includes('Blog validation failed: title: Path `title` is required.'))
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })

    test('if url is missing, api response with 400 Bad Request', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const token = helper.getToken()

      const missingUrl = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(helper.missingUrl)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      assert(missingUrl.body.error.includes('Blog validation failed: url: Path `url` is required.'))
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })
  })

  describe('deleting a blog', () => {
    test('succeeds with status 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]
      const token = helper.getToken()

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const titles = blogsAtEnd.map(b => b.title)
      assert(!titles.includes(blogToDelete.title))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

  describe('updating a blog', () => {
    test('succeeds if id is found', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      blogToUpdate.likes = 100

      await api.put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd[0].likes, blogToUpdate.likes)
    })
  })
  
  // after(async () => {
  //   await mongoose.connection.close()
  // })
})

describe('user api tests', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
  })

  describe('http GET requests', () => {
    test('http GET retrieves all users', async () => {
      const response = await api.get('/api/users')
      
      assert.strictEqual(response.body.length, helper.initialUsers.length)
    })
  })

  describe('http POST requests', () => {
    test('user creation succeeds with unique username', async () => {
      const usersAtStart = await helper.usersInDb()

      const uniqueUser = {
        username: 'uniqueuser',
        name: 'Unique User',
        password: '12345'
      }

      await api
        .post('/api/users')
        .send(uniqueUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(uniqueUser.username))
    })

    test('user creation with duplicate username returns 400', async () => {
      const usersAtStart = await helper.usersInDb()

      const duplicateUser = {
        username: 'curtisvize',
        name: 'Curtis',
        password: '12345'
      }

      const result = await api
        .post('/api/users')
        .send(duplicateUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      
      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('expected `username` to be unique'))
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('user creation with two character username returns appropriate reponse', async () => {
      const usersAtStart = await helper.usersInDb()

      const shortUser = {
        username: 'cu',
        name: 'Curtis',
        password: '12345'
      }

      const result = await api
        .post('/api/users')
        .send(shortUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      
      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('User validation failed: username'))
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('user creation with two character password returns appropriate reponse', async () => {
      const usersAtStart = await helper.usersInDb()

      const shortPassword = {
        username: 'curtis',
        name: 'Curtis',
        password: '12'
      }

      const result = await api
        .post('/api/users')
        .send(shortPassword)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      
      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('password must be at least 3 characters'))
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })

})

after(async () => {
  await mongoose.connection.close()
})
