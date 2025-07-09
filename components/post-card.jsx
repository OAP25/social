"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function PostCard({ post, currentUser, onLike, onComment, onDelete }) {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [isLiking, setIsLiking] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)

  const isLiked = post.likes?.includes(currentUser?.id)
  const isOwner = post.author?._id === currentUser?.id

  const handleLike = async () => {
    if (isLiking) return
    setIsLiking(true)
    await onLike(post._id)
    setIsLiking(false)
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || isCommenting) return

    setIsCommenting(true)
    await onComment(post._id, newComment)
    setNewComment("")
    setIsCommenting(false)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="flex items-center space-x-3 flex-1">
          <Avatar>
            <AvatarImage src={post.author?.avatar || "/placeholder.svg"} />
            <AvatarFallback>{post.author?.username?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{post.author?.username}</p>
            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onDelete(post._id)}>Delete Post</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      <CardContent className="pb-2">
        <p className="mb-3">{post.content}</p>
        {post.image && (
          <img
            src={post.image || "/placeholder.svg"}
            alt="Post content"
            className="w-full rounded-lg max-h-96 object-cover"
          />
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLiking}
              className={isLiked ? "text-red-500" : ""}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
              {post.likes?.length || 0}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.comments?.length || 0}
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showComments && (
          <div className="w-full space-y-3">
            <form onSubmit={handleComment} className="flex space-x-2">
              <Input
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isCommenting}>
                Post
              </Button>
            </form>

            <div className="space-y-2">
              {post.comments?.map((comment) => (
                <div key={comment._id} className="flex space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{comment.author?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">User</span> {comment.content}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
