import { Link } from 'react-router-dom'
import { usePosts } from '../context/PostsContext'

export default function PostList() {
  const { posts, loading, error } = usePosts()

  if (loading) return <p>Loading posts...</p>
  if (error) return <p>Error loading posts.</p>

  return (
    <div>
      <h2>Posts</h2>
      {posts.length === 0 && <p>No posts yet.</p>}
      <ul>
        {posts.map((p) => (
          <li key={p._id || p.id} style={{ marginBottom: 10 }}>
            <Link to={`/posts/${p._id || p.id}`}>{p.title || p.slug || 'Untitled'}</Link>
            <div style={{ fontSize: 12, color: '#666' }}>{p.excerpt}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
