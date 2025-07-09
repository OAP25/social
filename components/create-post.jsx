"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon } from "lucide-react"

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("")
  const [image, setImage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, image }),
      })

      if (response.ok) {
        setContent("")
        setImage("")
        onPostCreated()
      }
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mb-6">
      <CardHeader>
        <CardTitle>Create a Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL (optional)</Label>
            <div className="flex space-x-2">
              <ImageIcon className="h-5 w-5 text-gray-400 mt-2" />
              <Input
                id="image"
                placeholder="https://example.com/image.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {image && (
            <div className="mt-2">
              <img
                src={image || "/placeholder.svg"}
                alt="Preview"
                className="max-h-48 rounded-lg object-cover"
                onError={() => setImage("")}
              />
            </div>
          )}

          <Button type="submit" disabled={isLoading || !content.trim()}>
            {isLoading ? "Posting..." : "Post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
