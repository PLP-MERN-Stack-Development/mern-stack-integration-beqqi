const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return res.status(401).json({ success: false, message: 'No token provided' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    const user = await User.findById(decoded.id).select('-password')
    if (!user) return res.status(401).json({ success: false, message: 'Invalid token' })
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
}
