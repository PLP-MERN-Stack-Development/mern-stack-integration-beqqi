import { useState, useCallback } from 'react'

// A small custom hook to wrap API calls and give loading/error state
export default function useApi(fn) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(
    async (...args) => {
      setLoading(true)
      setError(null)
      try {
        const result = await fn(...args)
        setLoading(false)
        return result
      } catch (err) {
        setError(err)
        setLoading(false)
        throw err
      }
    },
    [fn]
  )

  return { execute, loading, error }
}
