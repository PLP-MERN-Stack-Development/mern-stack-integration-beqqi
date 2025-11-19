// clerkAuth.js - integrate Clerk on the server
// Notes: this file expects `@clerk/clerk-sdk-node` to be installed and
// `CLERK_API_KEY` (or other Clerk config) available in environment.

const { clerkExpressWithAuth } = require('@clerk/clerk-sdk-node/express') || {}
const { getAuth, clerkClient } = require('@clerk/clerk-sdk-node')

// Attach Clerk express middleware (parses Clerk headers/tokens)
const attachClerk = (() => {
  try {
    return clerkExpressWithAuth()
  } catch (err) {
    // If clerkExpressWithAuth isn't available, export a noop middleware
    return (req, res, next) => next()
  }
})()

// requireAuth: ensures a Clerk-authenticated user exists on the request
const requireAuth = async (req, res, next) => {
  try {
    const auth = getAuth ? getAuth(req) : null
    const userId = auth && auth.userId ? auth.userId : null
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' })

    // Optionally fetch full user profile and attach to req.user
    try {
      const user = clerkClient && clerkClient.users ? await clerkClient.users.getUser(userId) : { id: userId }
      req.user = user
    } catch (err) {
      // fallback to minimal user
      req.user = { id: userId }
    }

    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid Clerk session' })
  }
}

module.exports = { attachClerk, requireAuth }
