const express = require("express")
const { body, validationResult } = require("express-validator")
const Post = require("../models/Post")
const auth = require("../middleware/auth")

const router = express.Router()

// Get all posts
router.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const posts = await Post.find()
      .populate("author", "username avatar")
      .populate("comments.author", "username avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Post.countDocuments()

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get posts error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Create post
router.post("/", auth, async (req, res) => {
  try {
    console.log("=== CREATE POST REQUEST ===")
    console.log("User:", req.user.username, req.user._id)
    console.log("Request body:", req.body)

    const { content, image } = req.body

    // Validate that we have either content or image
    if (!content && !image) {
      console.log("No content or image provided")
      return res.status(400).json({ error: "Content or image is required" })
    }

    // If content is provided, it should not be empty
    if (content && !content.trim()) {
      console.log("Content is empty")
      return res.status(400).json({ error: "Content cannot be empty" })
    }

    console.log("Creating post with:", {
      content: content || "(no content)",
      image: image || "(no image)",
      author: req.user._id,
    })

    const post = new Post({
      content: content || "",
      image: image || "",
      author: req.user._id,
    })

    const savedPost = await post.save()
    console.log("Post saved successfully:", savedPost._id)

    // Populate the author information before sending response
    await savedPost.populate("author", "username avatar")

    console.log("Post created and populated successfully")

    res.status(201).json({
      message: "Post created successfully",
      post: savedPost,
    })
  } catch (error) {
    console.error("Create post error:", error)
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    })
    res.status(500).json({ error: "Server error: " + error.message })
  }
})

// Like/Unlike post
router.post("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ error: "Post not found" })
    }

    const userId = req.user._id
    const isLiked = post.likes.includes(userId)

    if (isLiked) {
      post.likes = post.likes.filter((id) => !id.equals(userId))
    } else {
      post.likes.push(userId)
    }

    await post.save()

    res.json({
      message: isLiked ? "Post unliked" : "Post liked",
      liked: !isLiked,
      likesCount: post.likes.length,
    })
  } catch (error) {
    console.error("Like post error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Add comment
router.post("/:id/comments", auth, async (req, res) => {
  try {
    const { content } = req.body

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Comment content is required" })
    }

    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ error: "Post not found" })
    }

    const comment = {
      content: content.trim(),
      author: req.user._id,
      createdAt: new Date(),
    }

    post.comments.push(comment)
    await post.save()
    await post.populate("comments.author", "username avatar")

    res.status(201).json({
      message: "Comment added successfully",
      comment: post.comments[post.comments.length - 1],
    })
  } catch (error) {
    console.error("Add comment error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Delete post
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ error: "Post not found" })
    }

    if (!post.author.equals(req.user._id)) {
      return res.status(403).json({ error: "Not authorized" })
    }

    await Post.findByIdAndDelete(req.params.id)
    res.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Delete post error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

module.exports = router
