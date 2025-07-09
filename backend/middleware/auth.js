const jwt = require("jsonwebtoken")
const User = require("../models/User")

const auth = async (req, res, next) => {
  try {
    console.log("Auth middleware - checking token")
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      console.log("No token provided in auth middleware")
      return res.status(401).json({ error: "No token, authorization denied" })
    }

    console.log("Token found, verifying...")
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log("Token decoded, user ID:", decoded.userId)

    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      console.log("User not found for token")
      return res.status(401).json({ error: "Token is not valid" })
    }

    console.log("User found:", user.username)
    req.user = user
    next()
  } catch (error) {
    console.error("Auth middleware error:", error.message)
    res.status(401).json({ error: "Token is not valid" })
  }
}

module.exports = auth
