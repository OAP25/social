"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Users, Calendar } from "lucide-react"

export default function UserProfile({ userId, currentUser }) {
  const [user, setUser] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [userId])

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setIsFollowing(userData.followers?.includes(currentUser?.id))
      }
    } catch (error) {
      console.error("Error fetching user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const result = await response.json()
        setIsFollowing(result.following)
        // Update follower count
        setUser((prev) => ({
          ...prev,
          followers: result.following
            ? [...(prev.followers || []), currentUser.id]
            : (prev.followers || []).filter((id) => id !== currentUser.id),
        }))
      }
    } catch (error) {
      console.error("Error following user:", error)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!user) {
    return <div className="text-center py-8">User not found</div>
  }

  const isOwnProfile = user._id === currentUser?.id

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <Avatar className="h-24 w-24 mx-auto mb-4">
          <AvatarImage src={user.avatar || "/placeholder.svg"} />
          <AvatarFallback className="text-2xl">{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">{user.username}</h1>
        <p className="text-gray-600">{user.email}</p>
        {user.bio && <p className="text-gray-700 mt-2">{user.bio}</p>}
      </CardHeader>

      <CardContent>
        <div className="flex justify-center space-x-8 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Users className="h-4 w-4" />
              <span className="font-semibold">{user.followers?.length || 0}</span>
            </div>
            <p className="text-sm text-gray-600">Followers</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Users className="h-4 w-4" />
              <span className="font-semibold">{user.following?.length || 0}</span>
            </div>
            <p className="text-sm text-gray-600">Following</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span className="font-semibold">{new Date(user.createdAt).getFullYear()}</span>
            </div>
            <p className="text-sm text-gray-600">Joined</p>
          </div>
        </div>

        {!isOwnProfile && (
          <div className="text-center">
            <Button onClick={handleFollow} variant={isFollowing ? "outline" : "default"}>
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
