const express = require('express')
const multer = require('multer')
const path = require('path')
const router = express.Router()

// configure multer storage to `uploads/`
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
    cb(null, name)
  },
})

const upload = multer({ storage })

// POST /api/uploads - single file upload (field name: file)
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' })
  // return publicly accessible path (server serves /uploads)
  const url = `/uploads/${req.file.filename}`
  res.status(201).json({ success: true, url })
})

module.exports = router
