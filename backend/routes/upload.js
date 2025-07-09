const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const auth = require("../middleware/auth")

const router = express.Router()

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, file.fieldname + "-" + uniqueSuffix + ext)
  },
})

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase()

  console.log("File upload attempt:", {
    originalname: file.originalname,
    mimetype: file.mimetype,
    extension: ext,
    size: file.size,
  })

  // Accept JPG, JPEG, PNG files
  if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
    console.log("File accepted based on extension")
    cb(null, true)
  } else if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    console.log("File accepted based on mimetype")
    cb(null, true)
  } else {
    console.log("File rejected - invalid type")
    cb(new Error(`Only JPG, JPEG, and PNG files are allowed. Got: ${file.mimetype} with extension ${ext}`), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

// Upload image endpoint
router.post("/", (req, res) => {
  console.log("=== UPLOAD REQUEST RECEIVED ===")
  console.log("Headers:", req.headers)
  console.log("Content-Type:", req.get("Content-Type"))

  // First check authentication
  const token = req.headers.authorization?.replace("Bearer ", "")
  if (!token) {
    console.log("No token provided")
    return res.status(401).json({ error: "No token provided" })
  }

  // Apply auth middleware manually
  auth(req, res, (authErr) => {
    if (authErr) {
      console.log("Auth failed:", authErr.message)
      return res.status(401).json({ error: "Authentication failed" })
    }

    console.log("Auth successful, user:", req.user._id)

    // Now handle file upload
    const uploadSingle = upload.single("image")

    uploadSingle(req, res, (uploadErr) => {
      if (uploadErr) {
        console.error("Upload error:", uploadErr.message)
        return res.status(400).json({ error: uploadErr.message })
      }

      if (!req.file) {
        console.error("No file in request")
        return res.status(400).json({ error: "No file uploaded" })
      }

      const imageUrl = `/uploads/${req.file.filename}`

      console.log("File uploaded successfully:", {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        url: imageUrl,
      })

      res.status(200).json({
        message: "Image uploaded successfully",
        imageUrl,
        filename: req.file.filename,
      })
    })
  })
})

module.exports = router
