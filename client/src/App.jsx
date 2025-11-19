import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import { PostsProvider } from './context/PostsContext'
import PostList from './pages/PostList'
import PostSingle from './pages/PostSingle'
import PostForm from './pages/PostForm'

function App() {
  return (
    <BrowserRouter>
      <PostsProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts/new" element={<PostForm />} />
            <Route path="/posts/:id" element={<PostSingle />} />
            <Route path="/posts/:id/edit" element={<PostForm />} />
          </Routes>
        </Layout>
      </PostsProvider>
    </BrowserRouter>
  )
}

export default App
