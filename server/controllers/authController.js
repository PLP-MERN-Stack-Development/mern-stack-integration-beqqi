const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateToken = (user) => {
  const payload = { id: user._id, email: user.email }
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    if (!email || !password || !name) return res.status(400).json({ success: false, message: 'Missing fields' })

    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ success: false, message: 'Email already registered' })

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = new User({ name, email, password: hash })
    await user.save()

    const token = generateToken(user)
    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    next(err)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ success: false, message: 'Missing fields' })

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' })

    const token = generateToken(user)
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    next(err)
  }
}
