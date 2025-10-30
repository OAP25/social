"use client"

import { useState } from "react"
import axios from "axios"
import "./CreatePost.css"

const CreatePost = ({ user, onPostCreated }) => {
  const [content, setContent] = useState("")
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploadError, setUploadError] = useState("")

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    console.log("Selected file:", {
      name: file.name,
      type: file.type,
      size: file.size,
    })

    // Validate file type
    const fileExtension = file.name.split(".").pop().toLowerCase()
    const validExtensions = ["jpg", "jpeg", "png"]

    if (!validExtensions.includes(fileExtension)) {
      setUploadError(`Invalid file type. Please select a JPG, JPEG, or PNG file.`)
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File is too large. Maximum size is 5MB.")
      return
    }

    setUploadError("")
    setImage(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.onerror = () => {
      setUploadError("Failed to read file")
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Allow posts with just content, just image, or both
    if (!content.trim() && !image) {
      setUploadError("Please add some content or select an image")
      return
    }

    setLoading(true)
    setUploadError("")

    try {
      let imageUrl = ""

      // Upload image if present
      if (image) {
        console.log("=== STARTING IMAGE UPLOAD ===")
        console.log("Image file:", image.name, image.type, image.size)

        const formData = new FormData()
        formData.append("image", image)

        const token = localStorage.getItem("token")

        try {
          const uploadResponse = await axios({
            method: "POST",
            url: "http://localhost:5000/api/upload",
            data: formData,
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
            timeout: 30000,
          })

          console.log("Upload successful:", uploadResponse.data)
          imageUrl = `http://localhost:5000${uploadResponse.data.imageUrl}`
        } catch (uploadError) {
          console.error("=== UPLOAD ERROR ===")
          console.error("Status:", uploadError.response?.status)
          console.error("Data:", uploadError.response?.data)

          const errorMsg = uploadError.response?.data?.error || uploadError.message
          setUploadError(`Image upload failed: ${errorMsg}`)
          setLoading(false)
          return
        }
      }

      // Create post
      console.log("=== CREATING POST ===")
      const token = localStorage.getItem("token")

      const postData = {
        content: content.trim(),
        image: imageUrl,
      }

      console.log("Post data being sent:", postData)

      const postResponse = await axios({
        method: "POST",
        url: "http://localhost:5000/api/posts",
        data: postData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Post created successfully:", postResponse.data)

      // Reset form
      setContent("")
      setImage(null)
      setImagePreview("")
      setUploadError("")

      // Notify parent component
      onPostCreated()
    } catch (error) {
      console.error("=== POST CREATION ERROR ===")
      console.error("Status:", error.response?.status)
      console.error("Data:", error.response?.data)
      console.error("Full error:", error)

      setUploadError("Failed to create post: " + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview("")
    setUploadError("")
  }

  return (
    <div className="create-post">
      <div className="create-post-header">
        <div className="avatar">
          {user.avatar ? (
            <img src={user.avatar || "/placeholder.svg"} alt={user.username} />
          ) : (
            <div className="avatar-placeholder">{user.username.charAt(0).toUpperCase()}</div>
          )}
        </div>
        <h3>Create a Post</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder={`What's on your mind, ${user.username}?`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="3"
        />

        {uploadError && <div className="error-message">{uploadError}</div>}

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview || "/placeholder.svg"} alt="Preview" />
            <button type="button" onClick={removeImage} className="remove-image">
              ✕
            </button>
          </div>
        )}

        <div className="post-actions">
          <label className="image-upload">
            <input type="file" accept=".jpg,.jpeg,.png" onChange={handleImageChange} style={{ display: "none" }} />📷
            Photo (JPG, JPEG, PNG)
          </label>

          <button type="submit" disabled={loading} className="post-button">
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost
