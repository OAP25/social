"use client"

import { useState, useEffect } from "react"
import AuthForm from "@/components/auth-form"
import Navbar from "@/components/navbar"
import CreatePost from "@/components/create-post"
import PostCard from "@/components/post-card"
import UserProfile from "@/components/user-profile"

export default function Home() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState("feed")

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      setUser(JSON.parse(userData))
      fetchPosts()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts")
      if (response.ok) {
        const postsData = await response.json()
        setPosts(postsData)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAuth = (userData) => {
    setUser(userData)
    fetchPosts()
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setPosts([])
    setCurrentView("feed")
  }

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchPosts() // Refresh posts to show updated likes
      }
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  const handleComment = async (postId, content) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        fetchPosts() // Refresh posts to show new comment
      }
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchPosts() // Refresh posts
      }
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm onAuth={handleAuth} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto py-6 px-4">
        {currentView === "feed" && (
          <div className="space-y-6">
            <CreatePost onPostCreated={fetchPosts} />

            <div className="space-y-6">
              {posts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No posts yet. Create the first post!</div>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    currentUser={user}
                    onLike={handleLike}
                    onComment={handleComment}
                    onDelete={handleDeletePost}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {currentView === "profile" && <UserProfile userId={user.id} currentUser={user} />}
      </main>
    </div>
  )
}
