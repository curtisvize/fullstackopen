const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    user: "68703185b6c17fee91a88c6e",
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    user: "68703185b6c17fee91a88c6e",
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    user: "68703185b6c17fee91a88c6e",
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    user: "68703185b6c17fee91a88c6e",
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    user: "68703185b6c17fee91a88c6e",
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    user: "68703185b6c17fee91a88c6e",
    __v: 0
  }  
]

const oneBlog = {
  _id: '5a422aa71b54a676234d17f9',
  title: 'My very cool blog',
  author: 'Curtis Vize',
  url: 'https://curtisvize.dev',
  likes: 5,
  user: "68703185b6c17fee91a88c6e",
  __v: 0
}

const missingLikes = {
  _id: '5a422aa71b54a676234d17f9',
  title: 'My very cool blog',
  author: 'Curtis Vize',
  url: 'https://curtisvize.dev',
  user: "68703185b6c17fee91a88c6e",
  __v: 0
}

const missingTitle = {
  _id: '5a422aa71b54a676234d17f9',
  author: 'Curtis Vize',
  url: 'https://curtisvize.dev',
  likes: 5,
  user: "68703185b6c17fee91a88c6e",
  __v: 0
}

const missingUrl = {
  _id: '5a422aa71b54a676234d17f9',
  title: 'My very cool blog',
  author: 'Curtis Vize',
  likes: 5,
  user: "68703185b6c17fee91a88c6e",
  __v: 0
}

const initialUsers = [
  {
    _id: '68703185b6c17fee91a88c6e',
    username: 'curtisvize',
    name: 'Curtis',
    passwordHash: '$2b$10$YZBHiGnhRapX0uZ1zuhdROJ/qtCVK8a4GWyxrE6meh.oGYfJf.DwW',
    blogs: [
      "5a422a851b54a676234d17f7",
      "5a422aa71b54a676234d17f8",
      "5a422b3a1b54a676234d17f9",
      "5a422b891b54a676234d17fa",
      "5a422ba71b54a676234d17fb",
      "5a422bc61b54a676234d17fc"
    ],
    __v: 0
  },
  {
    _id: '68703887f5a29ff54a0bf02e',
    username: 'mimiwa',
    name: 'Mitsu',
    passwordHash: '$2b$10$bjAbZcTKNR0/aUjHI2nuJuK8kGOnMtwpAeyZixUZ53NFXljiZ4O8C',
    __v: 0
  },
  {
    _id: '687038c9f5a29ff54a0bf033',
    username: 'fairfax',
    name: 'Fairfax',
    passwordHash: '$2b$10$HOYhoPXgD6XsR0cGOwotOe6Ng.ZkBgPS5XvW9Wnpn3mJHjgAf68vW',
    __v: 0
  }
]


const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const getToken = () => {
  const user = {
    username: initialUsers[0].username,
    id: initialUsers[0]._id
  }

  return jwt.sign(user, process.env.SECRET)
}

module.exports = { 
  initialBlogs,
  oneBlog,
  missingLikes,
  missingTitle,
  missingUrl,
  initialUsers,
  blogsInDb,
  usersInDb,
  getToken
}