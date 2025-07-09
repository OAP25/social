const express = require("express")
const User = require("../models/User")
const Post = require("../models/Post")
const auth = require("../middleware/auth")

const router = express.Router()

// Get user profile
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "username avatar")
      .populate("following", "username avatar")

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const posts = await Post.find({ author: user._id }).populate("author", "username avatar").sort({ createdAt: -1 })

    res.json({
      user,
      posts,
      stats: {
        postsCount: posts.length,
        followersCount: user.followers.length,
        followingCount: user.following.length,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

// Follow/Unfollow user
router.post("/:id/follow", auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id)
    const currentUser = await User.findById(req.user._id)

    if (!targetUser) {
      return res.status(404).json({ error: "User not found" })
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: "Cannot follow yourself" })
    }

    const isFollowing = currentUser.following.includes(targetUser._id)

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter((id) => !id.equals(targetUser._id))
      targetUser.followers = targetUser.followers.filter((id) => !id.equals(currentUser._id))
    } else {
      // Follow
      currentUser.following.push(targetUser._id)
      targetUser.followers.push(currentUser._id)
    }

    await currentUser.save()
    await targetUser.save()

    res.json({
      message: isFollowing ? "Unfollowed successfully" : "Followed successfully",
      following: !isFollowing,
      followersCount: targetUser.followers.length,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

// Update profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { username, bio, avatar } = req.body

    const user = await User.findByIdAndUpdate(req.user._id, { username, bio, avatar }, { new: true }).select(
      "-password",
    )

    res.json({
      message: "Profile updated successfully",
      user,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

// Search users
router.get("/search/:query", async (req, res) => {
  try {
    const query = req.params.query
    const users = await User.find({
      $or: [{ username: { $regex: query, $options: "i" } }, { email: { $regex: query, $options: "i" } }],
    })
      .select("-password")
      .limit(10)

    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

module.exports = router
