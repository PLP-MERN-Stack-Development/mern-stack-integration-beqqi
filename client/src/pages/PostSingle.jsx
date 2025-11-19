import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { postService } from '../services/api'

export default function PostSingle() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const data = await postService.getPost(id)
        if (mounted) setPost(data.data || data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => (mounted = false)
  }, [id])

  if (loading) return <p>Loading post...</p>
  if (error) return <p>Failed to load post.</p>
  if (!post) return <p>Post not found.</p>

  return (
    <article>
      <h2>{post.title}</h2>
      <p style={{ color: '#666' }}>{post.excerpt}</p>
      <div>{post.content}</div>
      <p>
        <Link to={`/posts/${id}/edit`}>Edit</Link>
      </p>
    </article>
  )
}
