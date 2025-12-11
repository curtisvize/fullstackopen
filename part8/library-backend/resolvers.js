const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments({}),
    authorCount: async () => Author.countDocuments({}),
    allBooks: async (root, args) => {
      let filtered = await Book.find({}).populate('author')

      if (args.author) {
        filtered = filtered.filter(b => b.author.name === args.author)
      }

      if (args.genre) {
        filtered = filtered.filter(b => b.genres.includes(args.genre))
      }

      return filtered
    },
    allAuthors: async () => {
      const authors = await Author.aggregate([
        {
          $lookup: {
            from: 'books',
            localField: '_id',
            foreignField: 'author',
            as: 'bookList'
          }
        },
        {
          $addFields: {
            bookCount: { $size: '$bookList' },
            id: '$_id'
          }
        },
        {
          $project: {
            id: 1,
            name: 1,
            born: 1,
            bookCount: 1
          }
        }
      ])

      return authors
    },
    me: (root, args, context) => context.currentUser
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      let author = await Author.findOne({ name: args.author })

      if (!author) {
        try {
          const newAuthor = new Author({ name: args.author })
          await newAuthor.save()
          author = newAuthor
        } catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }

      const book = new Book({ 
        title: args.title,
        published: args.published,
        genres: args.genres,
        author
      })

      try {
        await book.save()
        await book.populate('author')
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      return Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo },
        { new: true }
      )
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre
       })

      return user.save()
        .catch(error => {
          throw new GraphQLError('User creation failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers