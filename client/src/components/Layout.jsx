import Nav from './Nav'

export default function Layout({ children }) {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <Nav />
      <main>{children}</main>
    </div>
  )
}
