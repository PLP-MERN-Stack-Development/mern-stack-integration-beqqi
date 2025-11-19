import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <nav style={{ padding: 12, borderBottom: '1px solid #eee', marginBottom: 12 }}>
      <Link to="/" style={{ marginRight: 12 }}>
        Home
      </Link>
      <Link to="/posts/new" style={{ marginRight: 12 }}>
        New Post
      </Link>
    </nav>
  )
}
