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
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("social_media")
    const posts = db.collection("posts")

    const comment = {
      _id: new ObjectId(),
      content,
      author: userId,
      createdAt: new Date(),
    }

    await posts.updateOne({ _id: new ObjectId(id) }, { $push: { comments: comment } })

    return NextResponse.json({
      message: "Comment added successfully",
      comment,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
