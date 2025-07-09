import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { getAuthUser } from "@/lib/auth"

export async function POST(request, { params }) {
  try {
    const userId = await getAuthUser(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const client = await clientPromise
    const db = client.db("social_media")
    const posts = db.collection("posts")

    const post = await posts.findOne({ _id: new ObjectId(id) })
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const isLiked = post.likes.includes(userId)
    const updateOperation = isLiked ? { $pull: { likes: userId } } : { $push: { likes: userId } }

    await posts.updateOne({ _id: new ObjectId(id) }, updateOperation)

    return NextResponse.json({
      message: isLiked ? "Post unliked" : "Post liked",
      liked: !isLiked,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
