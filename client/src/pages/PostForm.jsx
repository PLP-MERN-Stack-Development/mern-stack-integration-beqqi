import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePosts } from '../context/PostsContext'
import { postService } from '../services/api'

export default function PostForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { categories, createPost, updatePost } = usePosts()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    if (!id) return
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const data = await postService.getPost(id)
        const post = data.data || data
        if (!mounted) return
        setTitle(post.title || '')
        setContent(post.content || '')
        setCategory(post.category || '')
        setExcerpt(post.excerpt || '')
      } catch (err) {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => (mounted = false)
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Client-side validation
    const errors = {}
    if (!title || title.trim().length < 3) errors.title = 'Title must be at least 3 characters'
    if (!content || content.trim().length < 10) errors.content = 'Content must be at least 10 characters'
    setValidationErrors(errors)
    if (Object.keys(errors).length > 0) return

    const payload = { title: title.trim(), content: content.trim(), category, excerpt }
    try {
      setSaving(true)
      if (id) {
        await updatePost(id, payload)
      } else {
        await createPost(payload)
      }
      navigate('/')
    } catch (err) {
      console.error(err)
      alert('Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2>{id ? 'Edit Post' : 'New Post'}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title</label>
            <br />
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            {validationErrors.title && (
              <div style={{ color: 'red', fontSize: 12 }}>{validationErrors.title}</div>
            )}
          </div>
          <div>
            <label>Excerpt</label>
            <br />
            <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          </div>
          <div>
            <label>Content</label>
            <br />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} required />
            {validationErrors.content && (
              <div style={{ color: 'red', fontSize: 12 }}>{validationErrors.content}</div>
            )}
          </div>
          <div>
            <label>Category</label>
            <br />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">-- none --</option>
              {categories.map((c) => (
                <option key={c._id || c.id} value={c._id || c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginTop: 8 }}>
            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
