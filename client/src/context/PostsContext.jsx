import React, { createContext, useContext, useState, useEffect } from 'react'
import { postService, categoryService, setTokenProvider } from '../services/api'
import { useAuth } from '@clerk/clerk-react'

const PostsContext = createContext(null)

export function usePosts() {
  return useContext(PostsContext)
}

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { getToken } = useAuth()

  const fetchPosts = async (page = 1, limit = 10, category = null) => {
    setLoading(true)
    setError(null)
    try {
      const data = await postService.getAllPosts(page, limit, category)
      setPosts(data.data || data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories()
      setCategories(data.data || data)
    } catch (err) {
      // ignore for now
    }
  }

  const createPost = async (payload) => {
    // Optimistic UI: add a temporary post immediately
    const tempId = `temp-${Date.now()}`
    const tempPost = { _id: tempId, title: payload.title, excerpt: payload.excerpt || '', content: payload.content, category: payload.category, isPublished: payload.isPublished || false }
    setPosts((p) => [tempPost, ...p])

    try {
      const data = await postService.createPost(payload)
      const created = data.data || data
      // Replace temp post with created post
      setPosts((p) => p.map((it) => (it._id === tempId ? created : it)))
      return data
    } catch (err) {
      // Rollback optimistic update
      setPosts((p) => p.filter((it) => it._id !== tempId))
      throw err
    }
  }

  const updatePost = async (id, payload) => {
    // Optimistic update: keep a snapshot to rollback on failure
    const snapshot = posts.slice()
    setPosts((p) => p.map((it) => (it._id === id ? { ...it, ...payload } : it)))
    try {
      const data = await postService.updatePost(id, payload)
      const updated = data.data || data
      setPosts((p) => p.map((it) => (it._id === id ? updated : it)))
      return data
    } catch (err) {
      // Rollback
      setPosts(snapshot)
      throw err
    }
  }

  const deletePost = async (id) => {
    const data = await postService.deletePost(id)
    setPosts((p) => p.filter((it) => it._id !== id))
    return data
  }

  useEffect(() => {
    fetchPosts()
    fetchCategories()

    // Wire Clerk token provider (if Clerk is available on client)
    if (typeof getToken === 'function') {
      setTokenProvider(async () => {
        try {
          return await getToken()
        } catch (err) {
          return null
        }
      })
    }
  }, [])

  const value = {
    posts,
    categories,
    loading,
    error,
    fetchPosts,
    fetchCategories,
    createPost,
    updatePost,
    deletePost,
  }

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
}
