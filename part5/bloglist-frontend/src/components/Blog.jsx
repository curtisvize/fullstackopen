import { useState } from 'react'

const Blog = ({ blog, like, remove, username }) => {
  const [details, setDetails] = useState(false)

  const toggleDetails = () => {
    setDetails(!details)
  }

  const label = details ? 'hide' : 'view'
  const showRemove = username === blog.user.username

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  return (
    <div style={blogStyle} className='blogContainer' data-testid='blog-container'>
      <div className='blogTitle'>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>{label}</button>
        { details &&
          <div className='blogDetails'>
            <div className='blogUrl'>
              {blog.url}
            </div>
            <div className='blogLikes'>
              likes <span className='likeCount'>{blog.likes}</span>
              <button onClick={like}>like</button>
            </div>
            <div className='blogUser'>
              {blog.user.name}
            </div>
            { showRemove &&
              <div>
                <button onClick={remove} data-testid='remove-button'>remove</button>
              </div>
            }
          </div>
        }
        </div>
      </div>
  )
}

export default Blog